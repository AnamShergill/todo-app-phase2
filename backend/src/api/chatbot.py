from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlmodel import Session
from ..database.session import get_session
from ..middleware.auth import verify_token
from ..services.task_service import TaskService
from ..schemas.task_schemas import TaskCreate, TaskUpdate, TaskComplete
from datetime import datetime
import re

router = APIRouter(prefix="/api/chatbot")


class ChatRequest(BaseModel):
    message: str
    # user_id will be extracted from the token, not from the request body


class ChatResponse(BaseModel):
    success: bool
    data: dict
    message: Optional[str] = None


@router.post("/process", response_model=ChatResponse)
async def process_chat_message(
    chat_request: ChatRequest,
    authenticated_user_id: int = Depends(verify_token),
    db: Session = Depends(get_session)
):
    """
    Process a natural language message and perform corresponding task operations.
    """
    task_service = TaskService(db)

    try:
        # Process the user's message to extract intent and task details
        message = chat_request.message.lower().strip()

        # Check for different types of requests
        if 'create' in message or 'add' in message or 'new' in message:
            # Extract task title from message
            title_match = re.search(r'(?:create|add|new)\s+(?:task|to-do|todo)\s+(?:called|named|titled)?\s*(.+?)(?:\.|,|$)', chat_request.message, re.IGNORECASE)
            title = title_match.group(1).strip() if title_match else "New Task"

            # Create a new task
            task_create_data = TaskCreate(
                title=title,
                description="",
                completed=False,
                priority="medium"
            )

            new_task = task_service.create_task(
                user_id=authenticated_user_id,
                task_data=task_create_data
            )

            response_text = f"I've created the task '{new_task.title}' for you."

        elif 'complete' in message or 'done' in message or 'finish' in message:
            # Try to identify the task to complete
            # Look for task identifiers in the message
            task_identifier = None
            # First look for numeric ID
            id_match = re.search(r'id\s*(\d+)', chat_request.message, re.IGNORECASE)
            if id_match:
                task_identifier = int(id_match.group(1))
            else:
                # Look for task title
                title_match = re.search(r'(?:task|to-do|todo)\s+(?:called|named|titled|"\s*([^"]+)\s*"|\'\s*([^\']+)\s*\')', chat_request.message, re.IGNORECASE)
                if title_match:
                    task_identifier = title_match.group(1) or title_match.group(2)

            if task_identifier:
                # Find the task by ID or title
                if isinstance(task_identifier, int):
                    # Find task by ID
                    task_to_complete = task_service.get_task_by_id(authenticated_user_id, task_identifier)
                else:
                    # Find task by title (get first matching task)
                    all_tasks = task_service.get_tasks_by_user(authenticated_user_id)
                    task_to_complete = next((task for task in all_tasks if task_identifier.lower() in task.title.lower()), None)

                if task_to_complete:
                    completion_data = TaskComplete(completed=True)
                    updated_task = task_service.update_task_completion(
                        user_id=authenticated_user_id,
                        task_id=task_to_complete.id,
                        completion_data=completion_data
                    )
                    response_text = f"I've marked the task '{updated_task.title}' as complete."
                else:
                    response_text = f"I couldn't find the task you mentioned. Please check the task name or ID."
            else:
                response_text = "I can help you complete tasks. Please specify which task by name or ID."

        elif 'delete' in message or 'remove' in message:
            # Try to identify the task to delete
            task_identifier = None
            # First look for numeric ID
            id_match = re.search(r'id\s*(\d+)', chat_request.message, re.IGNORECASE)
            if id_match:
                task_identifier = int(id_match.group(1))
            else:
                # Look for task title
                title_match = re.search(r'(?:task|to-do|todo)\s+(?:called|named|titled|"\s*([^"]+)\s*"|\'\s*([^\']+)\s*\')', chat_request.message, re.IGNORECASE)
                if title_match:
                    task_identifier = title_match.group(1) or title_match.group(2)

            if task_identifier:
                # Find the task by ID or title
                if isinstance(task_identifier, int):
                    # Find task by ID
                    task_to_delete = task_service.get_task_by_id(authenticated_user_id, task_identifier)
                else:
                    # Find task by title (get first matching task)
                    all_tasks = task_service.get_tasks_by_user(authenticated_user_id)
                    task_to_delete = next((task for task in all_tasks if task_identifier.lower() in task.title.lower()), None)

                if task_to_delete:
                    deleted = task_service.delete_task(
                        user_id=authenticated_user_id,
                        task_id=task_to_delete.id
                    )
                    if deleted:
                        response_text = f"I've deleted the task '{task_to_delete.title}'."
                    else:
                        response_text = f"Failed to delete the task '{task_to_delete.title}'."
                else:
                    response_text = f"I couldn't find the task you mentioned. Please check the task name or ID."
            else:
                response_text = "I can help you delete tasks. Please specify which task by name or ID."

        elif 'list' in message or 'show' in message or 'view' in message or 'all' in message or 'my tasks' in message:
            # Get user's tasks
            tasks = task_service.get_tasks_by_user(authenticated_user_id, limit=10)
            if tasks:
                task_list = [f"- {task.title} ({'✓' if task.completed else '○'}{' high' if task.priority == 'high' else ''})" for task in tasks]
                response_text = f"Here are your tasks:\n" + "\n".join(task_list)
            else:
                response_text = "You don't have any tasks yet. You can create one by saying 'Create a task called...'"

        elif 'help' in message or 'what can' in message or 'how do' in message:
            response_text = (
                "I can help you manage your tasks! You can ask me to:\n"
                "- Create a new task (e.g., 'Create a task called Buy groceries')\n"
                "- List your tasks (e.g., 'Show me my tasks')\n"
                "- Mark a task as complete (e.g., 'Mark shopping as complete')\n"
                "- Delete a task (e.g., 'Delete the meeting task')\n"
                "- Update task details"
            )

        else:
            response_text = (
                "I can help you manage your tasks. Try saying something like "
                "'Create a task called Buy groceries' or 'Show me my tasks'."
            )

        return ChatResponse(
            success=True,
            data={"response": response_text},
            message="Message processed successfully"
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing message: {str(e)}"
        )