import React, { useState, useContext, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material"
import { TodoContext } from "../contexts/todo"
import toast from "react-hot-toast"

const TodoForm = ({ open, onClose, todo = null }) => {
  const { createTodo, updateTodo } = useContext(TodoContext)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  })

  const isEditing = Boolean(todo)

  useEffect(() => {
    if (isEditing && todo) {
      setFormData({
        title: todo.title || "",
        description: todo.description || "",
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
        status: todo.status || "pending",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
      })
    }
  }, [isEditing, todo, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!formData.dueDate) {
      toast.error("Due date is required")
      return
    }

    setLoading(true)

    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: new Date(formData.dueDate).toISOString(),
        status: formData.status,
      }

      if (isEditing) {
        await updateTodo(todo._id, todoData)
        toast.success("Todo updated successfully")
      } else {
        await createTodo(todoData)
        toast.success("Todo created successfully")
      }

      onClose()
    } catch (error) {
      console.error("Error saving todo:", error)
      toast.error(isEditing ? "Failed to update todo" : "Failed to create todo")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{isEditing ? "Edit Todo" : "Create New Todo"}</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            autoFocus
          />

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            disabled={loading}
          />

          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth disabled={loading}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TodoForm
