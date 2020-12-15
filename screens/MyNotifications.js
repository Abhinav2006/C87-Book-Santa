import React from 'react';
import { Text, View, FlatList, StyleSheet, Image } from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config.js';

export default class MyNotifications extends React.Component{
    constructor(props){
        super(props);
        this.state = {userID: firebase.auth().currentUser.email,
                    allNotifications: []}
        this.notificationref = null
    }

    getNotifications=()=>{
        this.notificationref = db.collection("notification")
        .where("notificationStatus", "==", "unread")
        .where("targettedUserID", "==", this.state.userID)
        .onSnapshot((snapshot)=>{
            var allNotifications = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data()
                notification["doc_ID"] = doc.id
                allNotifications.push(notification)
            })
            this.setState({allNotifications:allNotifications})
        })
    }

    componentDidMount(){
        this.getNotifications()
    }
    render(){
        return(
            <View style = {{flex: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
                <View style = {{flex: 0.13}}>
                    <MyHeader title = {"Notifications"} navigation = {this.props.navigation}/>
                </View>
                <View style = {{flex: 0.8}}>
                    {this.state.allNotifications.length == 0?(
                    <Text>You have no notifications</Text>):
                    (
                        <SwipableList allNotifications = {this.state.allNotifications}/>
                    )}
                </View>
            </View>
        )
    }
}