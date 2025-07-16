import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Assignment,
  Warning,
  Add,
} from '@mui/icons-material';
import { TodoContext } from '../contexts/todo';
import { AuthContext } from '../contexts/auth';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { statistics, fetchStatistics, loading } = useContext(TodoContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const statsCards = [
    {
      title: 'Total Tasks',
      value: statistics.total,
      icon: Assignment,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
    {
      title: 'Completed',
      value: statistics.completed,
      icon: CheckCircle,
      color: 'success.main',
      bgColor: 'success.light',
    },
    {
      title: 'Pending',
      value: statistics.pending,
      icon: Schedule,
      color: 'warning.main',
      bgColor: 'warning.light',
    },
    {
      title: 'Overdue',
      value: statistics.overdue,
      icon: Warning,
      color: 'error.main',
      bgColor: 'error.light',
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your tasks
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ color: stat.color, fontSize: 24 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Quick Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/todos')}
            >
              Add New Task
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/todos')}
            >
              View All Tasks
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;