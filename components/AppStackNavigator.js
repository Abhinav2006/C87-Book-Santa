import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import BookDonateScreen from '../screens/BookDonateScreen';
import BookRecieverScreen from '../screens/BookRecieverScreen';

export const AppStackNavigator = createStackNavigator({
    BookDonateList: {screen:BookDonateScreen},
    RecieverDetails: {screen:BookRecieverScreen}
},{
    initialRouteName: 'BookDonateList'
})