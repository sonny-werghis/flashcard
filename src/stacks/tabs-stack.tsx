import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TOPICS_STACK, SETTINGS_STACK } from '@constants/screens';
import { useTheme } from '@theme/use-theme';
import { TopicIcon } from '@components/svg/topic-icon';
import { SettingsIcon } from '@components/svg/settings-icon';
import { SettingsStack } from '@stacks/settings-stack';
import { TopicsStack } from '@stacks/topics-stack';

const Tab = createBottomTabNavigator();

export const TabsStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.primary025,
        tabBarStyle: {
          backgroundColor: theme.primary100,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={TOPICS_STACK}
        component={TopicsStack}
        options={{
          tabBarIcon: TopicIcon,
        }}
      />
      <Tab.Screen
        name={SETTINGS_STACK}
        component={SettingsStack}
        options={{
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};
