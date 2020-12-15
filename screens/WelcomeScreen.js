import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends React.Component{
    constructor(){
        super();
        this.state = {emailID: '',
                    password: '',
                    isModalVisible: 'false',
                    firstName: '',
                    lastName: '',
                    address: '',
                    contact: '',
                    confirmPassword: ''}
    }

    userLogin = async(emailID, password)=>{
        firebase.auth().signInWithEmailAndPassword(emailID, password)
        .then(()=>{
            this.props.navigation.navigate('DonateBooks');
        }).catch((error)=>{
            var errorCode = error.code
            return Alert.alert(error.message)
        })
    }

    userSignUp = (username, password, confirmPassword)=>{
        if(password!=confirmPassword){
            return Alert.alert("Passwords do not match")
        } else {
            firebase.auth().createUserWithEmailAndPassword(username, password)
            .then((response)=>{return Alert.alert("User added successfully")})
            .catch(function (error){
                return Alert.alert(error.message)
            })
            db.collection('user').add({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                contact: this.state.contact,
                address: this.state.address,
                emailID: this.state.emailID,
                isBookRequest: false
            })
        }
    }

    showModal = ()=>{
        return(
            <Modal animationType = "fade"
            transparent = {true}
            visible = {this.state.isModalVisible}>
            <View style = {{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
            <ScrollView style = {{width: '100%'}}>
            <KeyboardAvoidingView style = {{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
            <Text>Registration</Text>
            <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}}
            placeholder = {"First Name"}
            maxLength = {8}
            onChangeText = {(text)=>{this.setState({firstName:text})}}/>
            <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}}
            placeholder = {"Last Name"}
            maxLength = {8}
            onChangeText = {(text)=>{this.setState({lastName:text})}}/>
            <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}}
            placeholder = {"Contact"}
            maxLength = {10}
            keyboardType = {'numeric'}
            onChangeText = {(text)=>{this.setState({contact:text})}}/>
            <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}}
            placeholder = {"Address"}
            multiline = {true}
            onChangeText = {(text)=>{this.setState({address:text})}}/>
            <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}}
            placeholder = {"Email"}
            keyboardType = {'email-address'}
            onChangeText = {(text)=>{this.setState({emailID:text})}}/>
            <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}}
            placeholder = {"Confirm Password"}
            secureTextEntry = {true}
            onChangeText = {(text)=>{this.setState({confirmPassword:text})}}/>
            <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}}
            placeholder = {"Password"}
            secureTextEntry = {true}
            onChangeText = {(text)=>{this.setState({password:text})}}/>
            <TouchableOpacity style = {styles.button} onPress = {()=>{this.userSignUp(this.state.emailID, this.state.password, this.state.confirmPassword)}}>
            <Text>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button} onPress = {()=>{
                this.setState({isModalVisible: false})
            }}>
            <Text>Cancel</Text>    
            </TouchableOpacity>
            </KeyboardAvoidingView>
            </ScrollView>
            </View>
            </Modal>
        )
    }

    render(){
        return(
            <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                    {this.showModal()}
                </View>
                <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}} placeholder = "abc@example.com"
                placeholderTextColor = '#fff'
                keyboardType = 'email-address'
                onChangeText = {(text)=>{this.setState({emailID:text})}}/>
                <TextInput style = {{borderWidth: 1.5, width: 300, height: 25}} placeholder = "password"
                placeholderTextColor = '#fff'
                secureTextEntry = {true}
                onChangeText = {(text)=>{this.setState({password:text})}}/>
                <TouchableOpacity style = {styles.button} onPress = {()=>{this.userLogin(this.state.emailID, this.state.password)}}>
                    <Text>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress = {()=>{
                    this.setState({isModalVisible: true})
                }}>
                    <Text>Sign Up</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    button:{
        borderWidth: 1,
        width: 150,
        height: 25,
        backgroundColor: 'red',
        shadowColor: '#000',
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16
    }
})