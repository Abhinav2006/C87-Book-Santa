import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class BookDonateScreen extends React.Component{
    constructor(){
        super();
        this.state = {requestedBookList:[]}
        this.requestedref = null
    }

    getRequestedBookList=()=>{
        this.requestref = db.collection("Requested_Books")
        .onSnapshot((snapshot)=>{
            var requestedBookList = snapshot.docs.map((doc)=>doc.data())
            console.log("getRequestedBookList")
            console.log(requestedBookList)
            this.setState({requestedBookList:requestedBookList})
        })
    }

    componentDidMount(){
        this.getRequestedBookList();
    }

    componentWillUnmount(){
        this.requestref();
    }

    renderItem = ({item,I})=>{
        return(
            <ListItem key = {I} title = {item.book_name}
            subtitle = {item.reason_to_request} titleStyle = {{color: 'black', fontWeight: 'bold'}}
            leftElement = {
                <Image style = {{width: 50, height: 50}}
                source = {{uri:item.image_link}}/>
            }
            rightElement = {
            <TouchableOpacity style = {styles.buttons}
            onPress={()=>{ console.log("view");
                this.props.navigation.navigate("RecieverDetails", {"details":item})}}>
                <Text>View</Text>
            </TouchableOpacity>}>
            </ListItem>
        )
    }

    keyExtractor = (Item, Index)=>{
        Index.toString();
    }

    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader title = "Donate Book" navigation = {this.props.navigation}/>
                <View style = {{flex:1}}>
                    {this.state.requestedBookList.length === 0?
                    (<View style = {{flex:1, fontSize: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>List of all Requested Books</Text>
                    </View>):
                    (<FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.requestedBookList}
                    renderItem = {this.renderItem}/>)}
                </View>
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
    }
});