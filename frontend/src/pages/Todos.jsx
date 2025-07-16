import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import { TodoContext } from '../contexts/todo';
import TodoItem from '../components/TodoItem';

const Todos = () => {
  const { fetchTodos, filters, updateFilters, todos, loading } = useContext(TodoContext);
  // eslint-disable-next-line no-unused-vars
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    fetchTodos(filters);
  }, [filters.status, filters.sortBy, filters.sortOrder, filters.dueDate]);

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddForm(true)}
        >
          Add Task
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <FilterList />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={filters.sortOrder}
                label="Order"
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={filters.dueDate}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : todos.length === 0 ? (
          <Alert severity="info">
            No todos found. Create your first task to get started!
          </Alert>
        ) : (
          <Box>
            <Typography variant="h6" mb={2}>
              {todos.length} task{todos.length !== 1 ? 's' : ''} found
            </Typography>
            {todos.map((todo,index) => (
              <TodoItem key={todo._id || index} todo={todo} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Todos;