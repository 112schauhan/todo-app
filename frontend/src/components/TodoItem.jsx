import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  CalendarToday,
  Schedule,
} from '@mui/icons-material';
import { TodoContext } from '../contexts/todo';

const TodoItem = ({ todo, onEdit }) => {
  const { updateTodo, deleteTodo, getActualStatus } = useContext(TodoContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(todo);
    }
  };

  const handleStatusChange = async (event) => {
    setLoading(true);
    try {
      const newStatus = event.target.checked ? 'completed' : 'pending';
      await updateTodo(todo._id, { status: newStatus });
    } catch (error) {
      console.error('Error updating todo status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setLoading(true);
      handleMenuClose();
      try {
        await deleteTodo(todo._id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      } finally {
        setLoading(false);
      }
    } else {
      handleMenuClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const actualStatus = getActualStatus(todo);

  const shouldBeInProgress = () => {
    if (todo.status === 'completed') return false;
    
    const now = new Date();
    const dueDate = new Date(todo.dueDate);
    const createdDate = new Date(todo.createdAt);
    
    if (dueDate < now) return false;
    
    if (todo.status === 'in_progress') return true;
    
    const daysSinceCreated = (now - createdDate) / (1000 * 60 * 60 * 24);
    const daysUntilDue = (dueDate - now) / (1000 * 60 * 60 * 24);
    
    return daysSinceCreated > 1 && daysUntilDue <= 3 && daysUntilDue > 0;
  };

  const displayStatus = shouldBeInProgress() && actualStatus === 'pending' ? 'in_progress' : actualStatus;

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderColor: 'primary.main',
        },
        opacity: loading ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 
            displayStatus === 'completed' ? '#10b981' :
            displayStatus === 'in_progress' ? '#3b82f6' :
            displayStatus === 'overdue' ? '#ef4444' :
            '#f59e0b',
        }}
      />
      
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={todo.status === 'completed'}
                    onChange={handleStatusChange}
                    disabled={loading}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                      },
                    }}
                  />
                }
                label=""
                sx={{ margin: 0 }}
              />
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                  color: todo.status === 'completed' ? 'text.secondary' : 'text.primary',
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {todo.title}
              </Typography>
              <Chip
                label={displayStatus === 'in_progress' ? 'In Progress' : displayStatus}
                size="small"
                sx={{
                  backgroundColor: 
                    displayStatus === 'completed' ? '#d1fae5' :
                    displayStatus === 'in_progress' ? '#dbeafe' :
                    displayStatus === 'overdue' ? '#fecaca' :
                    '#fef3c7',
                  color: 
                    displayStatus === 'completed' ? '#059669' :
                    displayStatus === 'in_progress' ? '#2563eb' :
                    displayStatus === 'overdue' ? '#dc2626' :
                    '#d97706',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              />
            </Box>

            {/* Description */}
            {todo.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                mb={2}
                sx={{ 
                  lineHeight: 1.6,
                  pl: 5,
                }}
              >
                {todo.description}
              </Typography>
            )}

            <Box display="flex" gap={4} sx={{ pl: 5 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Due: {formatDate(todo.dueDate)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Created: {formatDate(todo.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <IconButton
              onClick={handleMenuOpen}
              disabled={loading}
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
                <Edit sx={{ mr: 2, fontSize: 20 }} />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ py: 1.5, color: 'error.main' }}>
                <Delete sx={{ mr: 2, fontSize: 20 }} />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodoItem;