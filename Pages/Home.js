import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,ScrollView,Modal } from 'react-native';
import MoviesListview from "../Components/MoviesList"
import MenuDrawer from 'react-native-side-drawer'
import API from "../Libs/API"
import header_style from "../Styles/styles";
import Icon from 'react-native-vector-icons/FontAwesome';


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSidMenu: false,
      cat:"movies",
      modalVisible:false,
    };
    this.cats = [
      {'name':'Home','uri':'movies',},
      {'name':'Series','uri':'tv',},
      {'name':'Trending','uri':'trending',},
      {'name':'2019','uri':'movies/2019',},
      {'name':'2018','uri':'movies/2018',},
      {'name':'Bluray','uri':'movies/bluray',},
      {'name':'Bluray-webdl','uri':'movies/bluray-webdl',},
      {'name':'subtitled','uri':'movies/subbed',},
      {'name':'US','uri':'movies/us',},
      {'name':'Arabe','uri':'movies/arab',},
      {'name':'Egypt','uri':'movies/eg',},
      {'name':'Hindi','uri':'movies/hindi',},
      {'name':'Korean','uri':'movies/korean',},
      {'name':'Japanese','uri':'movies/japanese',},
      {'name':'Asian','uri':'movies/japanese-korean-mandarin-chinese-cantonese-thai',},
      {'name':'Horror','uri':'movies/horror',},
      {'name':'Action','uri':'movies/action',},
      {'name':'Romance','uri':'movies/romance',},
      {'name':'Comedy','uri':'movies/comedy',},
      {'name':'Animation','uri':'movies/animation',},
      {'name':'SCI-FI','uri':'movies/scifi',},
      {'name':'Documentary','uri':'movies/documentary',},
      {'name':'War','uri':'movies/war',},
      ]
      this.q = "";
      this.API = new API();
      this.API.getConfigs();
  }

  drawerContent = () => {
    let btns = this.cats.map( (category,v) => {
      return (
        <Button title={category["name"]}  key = {category["name"]}
        onPress={()=>{
          this.setState({cat:category["uri"],openSidMenu:false}); 
          this.props.navigation.setParams({cat:category["name"]});
          
          }} />
      );
    } );
    return (
      <ScrollView style={{color:"black"}}>
        {btns}
      </ScrollView>
    );
  };
  toggleOpen = () => {
    this.setState({ openSidMenu: !this.state.openSidMenu });
  };
  openModal = () => {
    this.setState({modalVisible:true});
  };
  openSettings = () => {
    this.props.navigation.navigate('Settings',{API:this.API});
  };
  componentDidMount(){
    this.props.navigation.setParams({
      cat: this.state.cat,
      toggleOpen  : this.toggleOpen,
      openModal   : this.openModal,
      openSettings: this.openSettings,
     })
  }
  static navigationOptions =  ({ navigation  }) => ({
    headerStyle: header_style.header,
    headerTitle: a=>{
      const {params = {}} = navigation.state;
      return (
        <View style={{flex:1,flexDirection:"row"}}>
          <Icon.Button name="reorder"
            onPress={ () => params.toggleOpen() }
            title="Menu"
          />
          <Icon.Button  name ="wrench"
            style={{backgroundColor:"black"}}
            iconStyle={{padding:0,margin:0,paddingRight:-2}}
            onPress={ () => params.openSettings() }
            title="Settings"
          />
          <Text style={header_style.title_home}>{navigation.getParam("cat")}</Text>
        </View>
      )
      },
    headerRight: a=>{
      const {params = {}} = navigation.state;
      return (
          <Icon.Button
            style={{backgroundColor:"black"}}
            name = "search"
            onPress={ () => params.openModal() }
            title="Search"
          />
      )
      },
  });
    render() {
      
      return (
        <View >
            <Modal 
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => { this.setState({ modalVisible:false,}); } }
            >
              <Text> Search for : </Text>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText ={a=>{
                  this.q=a;
                }}
                
              />
              <Button
                title="Search"
                color="green"
                onPress={()=>{
                  this.setState({cat:"/explore/?q="+this.q, modalVisible:false,});
                  this.q = ""
                  //this.visibleModal(false);
                }}
              ></Button>
            </Modal>
          <MenuDrawer 
            open={this.state.openSidMenu} 
            drawerContent={this.drawerContent()}
            drawerPercentage={45}
            animationTime={250}
            overlay={true}
            opacity={0.4}
            >
          </MenuDrawer>
          
          <ScrollView >
            <MoviesListview API={this.API} cat={this.state.cat} style={{backgroundColor:"black"}} ></MoviesListview>
          </ScrollView>
        </View>
      );
    }
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    zIndex: 0
  },
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812'
  }
})


export default HomeScreen;