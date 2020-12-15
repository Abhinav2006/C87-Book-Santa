import React from 'react';
import { StyleSheet, View, Text, ImagePickerIOS } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { DrawerItems } from 'react-navigation-drawer';
import firebase, { storage } from 'firebase';
import db from '../config';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class CustomSidebarMenu extends React.Component{
    constructor(){
        super();
        this.state = {image:"#",
                    userID: firebase.auth().currentUser.email,
                    name: "",
                    docID: ""}
    }
    uploadImage =async(uri,imageName)=>{
        var response = await fetch(uri)
        var blob = await response.blob()
        var ref = firebase.storage().ref().child("user_profiles/"+imageName)
        return ref.put(blob).then((response)=>{
            this.fetchImage(imageName)
        })
    }

    fetchImage=(imageName)=>{
        var storageref = firebase.storage().ref().child("user_profiles/"+imageName)
        storageref.getDownloadURL().then((URL)=>{
            this.setState({image:URL})
        })
    }

    selectPicture =async()=>{
        const{cancelled,uri}=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if(!cancelled){
            this.uploadImage(uri, this.state.userID)
        }
    }

    componentDidMount(){
        this.fetchImage(this.state.userID)
        this.getUserProfile()
    }

    getUserProfile(){
        db.collection("users").where("emailID","==",this.state.userID).onSnapshot((query)=>{
            query.forEach((doc)=>{this.setState({name:doc.data().firstName+doc.data().lastName,
            docID:doc.id,image:doc.data.image})})
        })
    }

    render(){
        return(
            <View style = {{flex:1}}>
                <Avatar rounded
                source = {{uri:this.state.image}}
                size = "medium"
                onPress={()=>{this.selectPicture()}}
                containerStyle = {{flex:0.75, width: "40%", height: "20%", marginLeft: 20, marginTop: 30, borderRadius: 40}}/>
                <Text>{this.state.name}</Text>
                <View style = {{flex:0.8}}>
                    <DrawerItems {...this.props}/>
                </View>
                <View style = {{flex:0.2, justifyContent: 'flex-end', paddingBottom: 30}}>
                    <TouchableOpacity style = {{height: 30, width: '100%', justifyContent: 'center'}}
                    onPress = {()=>{
                        this.props.navigation.navigate('WelcomeScreen')
                        firebase.auth().signOut();
                    }}>
                        <Text style = {{color: 'red'}}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}