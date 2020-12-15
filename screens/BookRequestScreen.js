import React, { Component } from 'react';
import { BookSearch } from 'react-native-google-books';
import { View, Text, FlatList, TextInput, TouchableOpacity, TouchableHighlight, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config.js';
import firebase from 'firebase';

export default class BookRequestScreen extends React.Component{
    constructor(){
        super();
        this.state = {userID: firebase.auth().currentUser.email,
                    bookName: "",
                    reasonToRequest: "",
                    isBookRequestActive: "",
                    userDocID: "",
                    book_status: "",
                    dataSource: "",
                    showFlatList: false
    }}

    async getBooksFromApi(bookName){
        this.setState({bookName:bookName})
        if(bookName.length>2){
            var books = await BookSearch.searchbook(bookName,'AIzaSyBhzhOs1O6-fgXJWnmOQUk3mk3eM50JOjc')
            this.setState({showFlatList: true, dataSource: books.data})
        }
        console.log(this.state.dataSource)
    }

    getBookRequest=()=>{
        var bookRequest = db.collection('Requested_Books').where('user_id', '==', this.state.userID).get().then((snapshot)=>{snapshot.forEach((doc)=>{
            if(doc.data().book_status!="received"){
                this.setState({request_id: doc.data().request_id, requestedBookName: doc.data().book_name, book_status:doc.data().book_status,documentID:doc.id});
            }
        })})
    }

    addRequest=async(bookName, reasonToRequest)=>{
        var userID = this.state.userID
        var documentID = Math.random().toString(36).substring(7)
        var books = await BookSearch.searchbook(bookName,'AIzaSyBhzhOs1O6-fgXJWnmOQUk3mk3eM50JOjc')
        db.collection('Requested_Books').add({
            "user_id":userID, 'book_name':bookName, 'reason_to_request':reasonToRequest, 'request_id':documentID, 'book_status':'requested',
            "image_link": books.data[0].volumeInfo.imageLinks.smallThumbnail
        })
        await this.getBookRequest()
        db.collection('user').where("emailID", "===", this.state.userID).get().then((snapshot)=>{snapshot.forEach((doc)=>{
            db.collection('user').doc(doc.id).update({isBookRequest: true})
        })})
        this.setState({bookName:'', reasonToRequest:''})
        Alert.alert("Book Requested Successfully")
    }
    
    getIsBookRequestActive=()=>{
        db.collection('user').where('emailID', '==', this.state.userID).onSnapshot(query=>{query.forEach(doc=>{
            this.setState({isBookRequest: doc.data().isBookRequest, userDocID:doc.id})
        })})
    }

    componentDidMount(){
        this.getBookRequest()
        this.getIsBookRequestActive()
    }

    recievedBooks=(bookName)=>{
        db.collection('receivedBooks').add({
            userId: this.state.userID,
            bookName: this.state.bookName,
            requestID: this.state.isBookRequestActive,
            bookStatus: this.state.book_status})
    }

    renderItem = ({item, i})=>{
        return(
            <TouchableHighlight style = {{alignItems: 'center', backgroundColor: '#DDDDDD', padding: 10, width: '90%'}}
            activeOpacity = {0.6}
            underlayColor = '#DDDDDD'
            onPress = {()=>{showFlatList: false, this.setState({bookName:item.volumeInfo.title})}}
            bottomDivider>
                <Text>{item.volumeInfo.title}</Text>
            </TouchableHighlight>
        )
    }

    render(){
        if(this.state.bookRequest === true){
            return(
                <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Book Name</Text>
                    <Text>this.state.requestedBookName</Text>
                    <Text>Book Status</Text>
                    <Text>this.state.book_status</Text>
                    <TouchableOpacity style = {{marginLeft: 125, borderWidth: 5, width: 200, height: 50}} onPress={()=>{this.updateBookRequest()
                    this.recievedBooks(this.state.requestedBookName)}}>
                        <Text>I received the book</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "Book Request" navigation = {this.props.navigation}/>
                <KeyboardAvoidingView style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <TextInput style = {styles.formTextInput} placeholder = {"Enter book name"}
                    onChangeText = {(text)=>this.getBooksFromApi(text)}
                    onClear = {text=>this.getBooksFromApi("")}
                    value = {this.state.bookName}/>
                    <FlatList data = {this.state.dataSource}
                    renderItem = {this.renderItem}
                    enableEmptySections = {true}
                    style = {{marginTop: 10}}
                    keyExtractor = {(item, index)=>index.toString()}/>
                    <TextInput style = {[styles.formTextInput, {height:300}]}
                    multiline
                    numberOfLines = {8}
                    placeholder = {"Why do you need the book?"}
                    onChangeText = {(text)=>this.setState({reasonToRequest:text})}
                    value = {this.state.reasonToRequest}/>
                <View style = {styles.buttons}>
                <TouchableOpacity onPress = {()=>{this.addRequest(this.state.bookName, this.state.reasonToRequest)}}>
                    <Text>Request</Text>
                </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttons:{
        backgroundColor: '#90A5A9',
        alignSelf: 'center',
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
    },
    formTextInput:{
        width: '75%',
        height: 35,
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10
    }
});