import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSidebarMenu from './CustomSidebarMenu';
import MyNotifications from '../screens/MyNotifications';
import MyDonations from '../screens/MyDonations';
import Settings from '../screens/Settings';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{screen:AppTabNavigator,
    navigationOptions:{
        drawerIcon: <Icon name = "home" type = "font-awesome5"/>}}
},
{MyDonations:{
    screen:MyDonations,
    navigationOptions: {
        drawerIcon: <Icon name = "gift" type = "font-awesome"/>,
        drawerLabel: "My Donations"
    }
}},
{MyNotifications:{
    screen:MyNotifications,
    navigationOptions: {
        drawerIcon: <Icon name = "bell" type = "font-awesome"/>,
        drawerLabel: "My Notifications"
    }
}
},
{Settings:{
    screen:Settings,
    navigationOptions: {
        drawerIcon: <Icon name = "settings" type = "fontawesome5"/>,
        drawerLabel: "Settings"
    }
}},
{
    contentComponent:CustomSidebarMenu
},{
    initialRouteName:'Home'
})