import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-navigation';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { ListItem } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class MyDonations extends React.Component{
    constructor(){
        super();
        this.state = {
            donorID: firebase.auth().currentUser.email,
            donorName: "",
            AllDonations: []
        }
        this.requestref = null
    }

    componentDidMount(){
        this.getDonorDetails(this.state.donorID)
        this.getAllDonations()
    }

    getDonorDetails =(donorID)=>{
        db.collection('user').where("emailID", "==", this.state.donorID ).get().then((snapshot)=>{snapshot.forEach((doc)=>{
            this.setState({donorName: doc.data().first_name + "" + doc.data().last_name})
        })})
    }

    getAllDonations=()=>{
        this.requestref = db.collection("all_donations").where("donor_id", "==", this.state.donorID)
        .onSnapshot((snapshot)=>{var allDonations = []
        snapshot.docs.map((doc)=>{var donation = doc.data()
        donation["doc_id"] = doc.id
    allDonations.push(donation)})
            this.setState({AllDonations:allDonations})
    })
    }

    keyExtractor = (Item, Index)=>{
        Index.toString();
    }

    sendBook=(bookDetails)=>{
        if(bookDetails.request_status = "Books Sent"){
            db.collection("all_donations").doc(bookDetails.doc_id).update({request_status:"Donor Interested"})
            this.sendNotification(bookDetails,"Donor Interested")
        }else{
            db.collection("all_donations").doc(bookDetails.doc_id).update({request_status:"Book Sent"})
            this.sendNotification(bookDetails,"Book Sent")
        }
    }

    sendNotification=(bookDetails, request_status)=>{
        var request_id = bookDetails.request_id
        var donor_id = bookDetails.donor_id
        db.collection("notification").where("request_id","==",request_id).where("donor_id","==", donor_id)
        .get().then((snapshot)=>{snapshot.forEach((doc)=>{
            var message = ""
            if(request_status == "Book Sent"){
                message = this.state.donorName+"Sent you Book"
            }else{
                message = this.state.donorName+"Has shown interest in donating the book"
            }
            db.collection("notification").doc(doc.id).update({
                "Message": message, "notification_status": "unread","date":firebase.firestore.FieldValue.serverTimestamp()
            })
        })})
    }

    renderItem =({item, i})=>(<ListItem key = {i} title = {item.book_Name}
        subtitle = {"Requested By:" + item.requested._by + "status:" + item.request_status} leftElement = {<Icon name = "book" type = "font-awesome" color = '#696969'/>}
        rightElement = {
            <TouchableOpacity onPress = {()=>{this.sendBook(item)}}>
                <Text>Sent Book</Text>
            </TouchableOpacity>
        }/>
        )

    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader navigation = {this.props.navigation} title = "My Donations"/>
                <View style = {{flex:1}}>
                    <Text>Donations</Text>
                </View>
            </View>
        )
    }
}