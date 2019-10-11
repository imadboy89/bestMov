import { StyleSheet } from 'react-native';

const header_style = StyleSheet.create({
    header:{
        backgroundColor : "#34495e",
    },
    container : {
     flex:1,flexDirection:"row",
    },
    title:{
        fontSize:16,
        color:"#e67e22",
        width:"80%",
    },
    title_home:{
        fontSize:20,
        color:"#e67e22",
        marginLeft:10,
        width:"80%",
    }
 
 });

 export default header_style;