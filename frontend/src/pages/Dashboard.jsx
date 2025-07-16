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
  Paper,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Assignment,
  Warning,
  Add,
  Visibility,
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
      color: '#2563eb',
      bgColor: '#dbeafe',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    },
    {
      title: 'Completed',
      value: statistics.completed,
      icon: CheckCircle,
      color: '#059669',
      bgColor: '#d1fae5',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    },
    {
      title: 'Pending',
      value: statistics.pending,
      icon: Schedule,
      color: '#d97706',
      bgColor: '#fef3c7',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    },
    {
      title: 'Overdue',
      value: statistics.overdue,
      icon: Warning,
      color: '#dc2626',
      bgColor: '#fecaca',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
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
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
      <Box mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
          }}
        >
          Welcome back, {user?.name}!
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          Here's an overview of your tasks
        </Typography>
      </Box>

      <Grid container spacing={4} mb={6}>
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} lg={3} key={stat.title}>
              <Card 
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  },
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
                    background: stat.gradient,
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography 
                        variant="h3" 
                        component="div" 
                        fontWeight="bold"
                        sx={{ 
                          color: stat.color,
                          mb: 1,
                          fontSize: { xs: '2rem', sm: '2.5rem' }
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.title}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ color: stat.color, fontSize: 28 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 600, mb: 3 }}
        >
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box 
          display="flex" 
          gap={2} 
          flexWrap="wrap"
          justifyContent={{ xs: 'center', sm: 'flex-start' }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/todos')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              },
            }}
          >
            Add New Task
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Visibility />}
            onClick={() => navigate('/todos')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            View All Tasks
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;