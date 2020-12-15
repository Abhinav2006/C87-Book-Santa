import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

export default class SwipableList extends React.Component{
    constructor(props){
        super(props);
        this.state = {allNotifications: this.props.allNotifications}
    }
    onSwipeValueChange = swipeData=>{
        var allNotifications = this.state.allNotifications
        const {key, value} = swipeData
        if(value < -Dimensions.get('window').width){
            const newData = [...allNotifications]
            const previousIndex = allNotifications.findIndex(item=>item.key === key)
            this.updatemarkasread(allNotifications[previousIndex])
            newData.splice(previousIndex,1)
            this.setState({allNotifications:newData})
        }
    }
    updatemarkasread=(Notifications)=>{
        db.collection("notification").doc(Notifications.doc_id).update({"notification_status": "read"})
    }
    renderItem = (data)=>(
        <Animated.View>
            <ListItem leftElement = {<Icon name = "book" type = "font-awesome" color = '#696969'/>} title = {data.item.book_name}
            titleStyle = {{color: 'black', fontWeight: 'bold'}} subtitle = {data.item.message}
            bottomDivider/>
        </Animated.View>
    )

    renderHiddenItem=()=>{
        <View style = {{alignItems: 'center', backgroundColor: '#29d6f6', flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15}}>
            <View style = {{alignItems: 'center', bottom: 0, justifyContent: 'center', position: 'absolute', top: 0, width: 100}}>
                <Text></Text>
            </View>
        </View>
    }

    render(){
        return(
            <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <SwipeListView
                disableRightSwipe
                data = {this.state.allNotifications}
                renderItem = {this.renderItem}
                renderHiddenItem = {this.renderHiddenItem}
                rightOpenValue = {-Dimensions.get('window').width}
                previewRowKey = {'0'}
                previewOpenValue = {-40}
                previewOpenDelay = {3000}
                onSwipeValueChange = {this.onSwipeValueChange}/>
            </View>
        )
    }
}