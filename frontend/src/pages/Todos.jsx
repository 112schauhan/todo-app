import React, { useState, useEffect, useContext } from "react"
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
  Divider,
  InputAdornment,
} from "@mui/material"
import {
  Add,
  FilterList,
  Search,
  CalendarToday,
  Schedule,
  Title,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material"
import { TodoContext } from "../contexts/todo"
import TodoItem from "../components/TodoItem"
import TodoForm from "../components/TodoForm"

const Todos = () => {
  const { fetchTodos, filters, updateFilters, todos, loading } =
    useContext(TodoContext)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {
    fetchTodos(filters)
  }, [filters.status, filters.sortBy, filters.sortOrder])

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value })
  }

  const handleAddTodo = () => {
    setShowAddForm(true)
  }

  const handleEditTodo = (todo) => {
    setEditingTodo(todo)
  }

  const handleCloseForm = () => {
    setShowAddForm(false)
    setEditingTodo(null)
  }

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            My Tasks
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            Manage and organize your todos
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={handleAddTodo}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
            },
          }}
        >
          Add Task
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <FilterList sx={{ color: "primary.main" }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Filters & Search
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search todos"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search by title or description"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange("status", e.target.value)}
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                }}
                renderValue={(selected) => {
                  if (!selected) return "All"
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor:
                            selected === "completed"
                              ? "#10b981"
                              : selected === "in_progress"
                              ? "#3b82f6"
                              : selected === "pending"
                              ? "#f59e0b"
                              : "#6b7280",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{ textTransform: "capitalize", fontSize: "0.9rem" }}
                      >
                        {selected === "in_progress" ? "In Progress" : selected}
                      </Typography>
                    </Box>
                  )
                }}
              >
                <MenuItem value="">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#6b7280",
                        flexShrink: 0,
                      }}
                    />
                    <Typography>All</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="pending">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#f59e0b",
                        flexShrink: 0,
                      }}
                    />
                    <Typography>Pending</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="in_progress">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        flexShrink: 0,
                      }}
                    />
                    <Typography>In Progress</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="completed">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                        flexShrink: 0,
                      }}
                    />
                    <Typography>Completed</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                sx={{
                  borderRadius: 2,
                }}
                renderValue={(selected) => {
                  const getIcon = () => {
                    switch (selected) {
                      case "createdAt":
                        return <Schedule sx={{ fontSize: 16 }} />
                      case "dueDate":
                        return <CalendarToday sx={{ fontSize: 16 }} />
                      case "title":
                        return <Title sx={{ fontSize: 16 }} />
                      default:
                        return null
                    }
                  }
                  const getLabel = () => {
                    switch (selected) {
                      case "createdAt":
                        return "Created Date"
                      case "dueDate":
                        return "Due Date"
                      case "title":
                        return "Title"
                      default:
                        return selected
                    }
                  }
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      {getIcon()}
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {getLabel()}
                      </Typography>
                    </Box>
                  )
                }}
              >
                <MenuItem value="createdAt">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <Schedule sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography>Created Date</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="dueDate">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <CalendarToday
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography>Due Date</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="title">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <Title sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography>Title</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={filters.sortOrder}
                label="Order"
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                sx={{
                  borderRadius: 2,
                }}
                renderValue={(selected) => {
                  const getIcon = () => {
                    return selected === "asc" ? (
                      <ArrowUpward sx={{ fontSize: 16 }} />
                    ) : (
                      <ArrowDownward sx={{ fontSize: 16 }} />
                    )
                  }
                  const getLabel = () => {
                    return selected === "asc" ? "Ascending" : "Descending"
                  }
                  return (
                    <Box display="flex" alignItems="center" gap={1}>
                      {getIcon()}
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {getLabel()}
                      </Typography>
                    </Box>
                  )
                }}
              >
                <MenuItem value="asc">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <ArrowUpward
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography>Ascending</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="desc">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <ArrowDownward
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography>Descending</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" p={6}>
            <CircularProgress size={48} />
          </Box>
        ) : todos.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No todos found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {filters.search || filters.status
                ? "Try adjusting your filters or search terms"
                : "Create your first task to get started!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddTodo}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Add Your First Task
            </Button>
          </Paper>
        ) : (
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              sx={{ px: 1 }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                {todos.length} task{todos.length !== 1 ? "s" : ""} found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filters.status && `Filtered by: ${filters.status}`}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {todos.map((todo) => (
                <TodoItem key={todo._id} todo={todo} onEdit={handleEditTodo} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Todo Form Dialog */}
      <TodoForm
        open={showAddForm || Boolean(editingTodo)}
        onClose={handleCloseForm}
        todo={editingTodo}
      />
    </Box>
  )
}

export default Todos
