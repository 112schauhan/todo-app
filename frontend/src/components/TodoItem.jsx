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

const TodoItem = ({ todo }) => {
  const { updateTodo, deleteTodo } = useContext(TodoContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    setLoading(true);
    handleMenuClose();
    try {
      await deleteTodo(todo._id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && todo.status !== 'completed';
  };

  const actualStatus = isOverdue(todo.dueDate) ? 'overdue' : todo.status;

  return (
    <Card sx={{ mb: 2, opacity: loading ? 0.6 : 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            {/* Title and Status */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={todo.status === 'completed'}
                    onChange={handleStatusChange}
                    disabled={loading}
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
                }}
              >
                {todo.title}
              </Typography>
              <Chip
                label={actualStatus}
                color={getStatusColor(actualStatus)}
                size="small"
              />
            </Box>

            {/* Description */}
            {todo.description && (
              <Typography variant="body2" color="text.secondary" mb={2}>
                {todo.description}
              </Typography>
            )}

            {/* Dates */}
            <Box display="flex" gap={3}>
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

          {/* Actions Menu */}
          <Box>
            <IconButton
              onClick={handleMenuOpen}
              disabled={loading}
              size="small"
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Edit sx={{ mr: 1, fontSize: 20 }} />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <Delete sx={{ mr: 1, fontSize: 20 }} />
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