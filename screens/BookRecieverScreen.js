import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { Card, Icon, Header } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class BookRecieverScreen extends React.Component{
    constructor(props){
        console.log("constructor");
        super(props);
        this.state = {userID: firebase.auth().currentUser.email,
                    recieverID: this.props.navigation.getParam('details')["user_id"],
                    requestID: this.props.navigation.getParam('details')["request_id"],
                    bookName: this.props.navigation.getParam('details')["book_name"],
                    reasonforRequest: this.props.navigation.getParam('details')["reason_to_request"],
                    receiverName: '',
                    receiverContact: '',
                    receiverAddress: '',
                    receirRequestDocId: '',
                    username: ''}
    }

    getReceiverDetails(){
        console.log("getRecieverDetails")
        console.log(this.state.recieverID)
        db.collection('user').where('emailID','==',this.state.recieverID).get()
        .then(snapshot=>{snapshot.forEach(doc=>{
            this.setState({
                receiverName: doc.data().firstName,
                receiverContact: doc.data().contact,
                receiverAddress: doc.data().address
            })
        })})
    }

    componentDidMount(){
        this.getReceiverDetails();
    }

    addNotifications=()=>{
        var message = this.state.username+"has shown interest in donating the book"
        db.collection("notification").add({"targettedUserID": this.state.recieverID,
    "donorID": this.state.userID, "requestID": this.state.requestID, "bookName": this.state.bookName, "date": firebase.firestore.FieldValue.serverTimestamp(),
    "notificationStatus": "unread", "message": message})
    }

    render(){
        return(
            <View style = {{flex:1}}>
                <View style = {{flex:0.1}}>
                    <Header leftComponent = {<Icon name = 'arrow-left' type = 'feather' color = '#696969' onPress = {()=> this.props.navigation.goBack()}/>}
                    centerComponent = {{text: "Donate Books", style: {color: '#90a5a9', fontSize: 20, fontWeight: 'bold'}}}
                    backgroundColor = "#eaf8fe"/>
                </View>
                <View style = {{flex:0.3}}>
                    <Card title = {"BookInformation"} titleStyle = {{fontSize: 20}}>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Book name: {this.state.bookName}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Reason to Request: {this.state.reasonforRequest}</Text>
                        </Card>
                    </Card>
                </View>
                <View style = {{flex:0.3}}>
                    <Card title = {"ReceiverInformation"} titleStyle = {{fontSize: 20}}>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Name: {this.state.receiverName}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Contact: {this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>Address: {this.receiverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View style = {{flex:0.3, justifyContent: 'center', alignItems: 'center'}}>
                    {this.state.recieverID!=this.state.userID?(
                        <TouchableOpacity style = {{height: 50, width: 250}} onPress = {()=>{this.addNotifications()
                        this.updateBookStatus()
                        this.props.navigation.navigate("MyDonations")}}>
                            <Text>I want to donate</Text>
                        </TouchableOpacity>
                    ):null}
                </View>
            </View>
        )
    }
}