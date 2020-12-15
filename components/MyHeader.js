import React from 'react';
import { Icon, Header } from 'react-native-elements';
import { View, Text, StyleSheet} from 'react-native';
const MyHeader = props =>{
    return(<Header centerComponent = {{text:props.title,style:{color:'#90A5A9', fontSize: 24, fontWeight: 'bold'}}}
    backgroundColor = '#eaf8fe'/>)
}

export default MyHeader;