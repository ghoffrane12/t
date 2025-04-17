import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  useTheme,
} from '@mui/material';
import AccountSettings from './sections/AccountSettings';
import NotificationSettings from './sections/NotificationSettings';
import BudgetSettings from './sections/BudgetSettings';
import SecuritySettings from './sections/SecuritySettings';
import DisplaySettings from './sections/DisplaySettings';
import IntegrationSettings from './sections/IntegrationSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Paramètres
        </Typography>

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Tab label="Compte" {...a11yProps(0)} />
            <Tab label="Notifications" {...a11yProps(1)} />
            <Tab label="Budgets" {...a11yProps(2)} />
            <Tab label="Sécurité" {...a11yProps(3)} />
            <Tab label="Affichage" {...a11yProps(4)} />
            <Tab label="Intégrations" {...a11yProps(5)} />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            <AccountSettings />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <NotificationSettings />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <BudgetSettings />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <SecuritySettings />
          </TabPanel>
          <TabPanel value={currentTab} index={4}>
            <DisplaySettings />
          </TabPanel>
          <TabPanel value={currentTab} index={5}>
            <IntegrationSettings />
          </TabPanel>
        </Paper>
      </Paper>
    </Container>
  );
};

export default Settings; 