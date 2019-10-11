import React from 'react';
import {ToastAndroid, StyleSheet, Text, View, Button, AsyncStorage,ScrollView,BackHandler ,Picker,Switch  } from 'react-native';
import API from "../Libs/API";
import loader from "../Components/Loader";
//import { Icon, } from 'react-native-icons';
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex:1,
        flexDirection: 'column',
        
  
  
    },
    row_view : {
      flex: 1, 
      flexDirection: 'row' ,
      //alignItems: 'flex-start',
      alignItems: 'center',
      height : 30 ,
      marginRight:20,
      marginLeft:20,
      marginBottom:10,
      borderStyle : "solid",
      borderWidth : 1,
      textAlign: 'right',
      width:"95%",
    },
    row_q : {
      flex: 1, 
      flexDirection: 'column' ,
      //alignItems: 'flex-start',
      //alignItems: 'flex-end',
      height : 30 ,
      width : 100,
      borderStyle : "solid",
      borderWidth : 1,
      textAlign: 'right',
      
    },
    title: {
        
        fontSize: 18,
        color: '#000',
    },

    text_k: {
      //backgroundColor:"#34495e",
      fontSize: 16,
      fontWeight: 'bold',
      width:"30%",
      color:"white",
      textAlign: 'right'
    },
    text_v: {
      //backgroundColor:"#34495e",
      marginLeft:20,
      fontSize: 14,
      fontWeight: 'bold',
      width:"65%",
      color:"white",
      textAlign: 'left'
    },
    image: {
        flex:1,
  
    },
    row : {
        flex:1,
        flexDirection:"row"
    },
    small_elemnt:{
        width:60,
        justifyContent:"center"
    }
  });

  
class SettingsScreen extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        webView_visible : true,
        links_manager   : "",
        cache_cleared:false,
      };
      this.API = this.props["navigation"].getParam("API");
      this.API.getConfigs_local().then( configs=>{
        this.setState({webView_visible : configs.webView_visible,links_manager   : configs.links_manager});
      });
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    //####################### BACK HANDLER ###################################
    componentWillMount() {BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);}
    componentWillUnmount() {BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);}
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
      return true;
    }
    //##########################################################
    save(){

    }
    cancel(){

    }
    componentDidMount(){
      this.props.navigation.setParams({save: this.save,cancel : this.cancel });
    }
    static navigationOptions =  ({ navigation  }) => ({
      headerStyle: {
        backgroundColor: '#34495e',
      },
      headerTitle: a=>{
          const {state} = navigation;
          return (<Text style={{fontSize:18,color:"#e67e22"}}>Settings</Text>)},
      headerRight: a=>{
        const {params = {}} = navigation.state;
        return (
          <View style={styles.row}>
            <Button style={{backgroundColor:"#141514"}}
              color="black"
              onPress={ () => params.save() }
              title="Save"
            />
            <Button style={{backgroundColor:"#141514"}}
              color="black"
              onPress={ () => params.cancel() }
              title="Cancel"
            />
          </View>
        )
        },
  
    });
    saveConfig(key,value){
      this.API.setConfig(key,value);
      this.setState({[key]:value});
    }
    clearCache = async ()=>{
        await AsyncStorage.setItem("movies", JSON.stringify({}) );
        this.setState({cache_cleared:true});
        ToastAndroid.showWithGravity(
            "The cache is cleaded !",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
    }
    get_API_links(){
        return this.API.configs["action_link"].map( (link,v) =>{
            return (
                <Picker.Item label={link.split("/")[2]} value={link} key={link} />
            );
        })
    }
    render() {
      return (
        <View style={{backgroundColor:"black"}}>
            <ScrollView >
                <View style={styles.container}>

                    <View style={styles.row_view}>
                        <Text style={styles.text_k}> Hide WV  :</Text>
                        <View style={styles.text_v}>
                            <Switch 
                                style={styles.small_elemnt}
                                value = {this.state.webView_visible}
                                onValueChange={ (newValue)=> {
                                    this.saveConfig("webView_visible", newValue)
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.row_view}>
                        <Text style={styles.text_k}> API  : </Text>
                        <Picker
                        selectedValue={this.state.links_manager}
                        style={styles.text_v}
                        onValueChange={(itemValue, itemIndex) =>
                            this.saveConfig("links_manager", itemValue)
                            
                        }>
                            {this.get_API_links()}
                        </Picker>

                    </View>

                    <View style={styles.row_view}>
                        <Text style={styles.text_k}> Clear cache  :</Text>
                        <View style={styles.text_v}>
                            <View style={styles.small_elemnt}>
                            <Button
                                title="Clear"
                                color="orange"
                                disabled={this.state.cache_cleared}
                                onPress={this.clearCache}
                            />
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
      );
    }
  
  }
  
  export default SettingsScreen;