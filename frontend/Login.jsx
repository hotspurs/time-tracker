import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Tabs, Tab, Input, ButtonInput, Panel} from 'react-bootstrap';
import qwest from 'qwest';

require("./styles/bootstrap.css");

export default class Login extends React.Component {
 constructor() {
  super();
  this.state = {
    email: '',
    password: '',
    key: 1
  }
 }
  onLoginSubmit(e) {
    e.preventDefault();
    var email = this.state.email,
        password = this.state.password,
        self = this;

    if(!email || !password) return;

    qwest.post('/login', {
        email: email,
        password: password,
     })
     .then(function(xhr, response) {
        
        if(response.message){
          self.setState({error: true, errorMessage: response.message});
        }

        if(response.redirect){
          window.location = '/'
        }

     })
     .catch(function(xhr, response, e) {
        
     });
  }
  onRegisterSubmit(e) {
    e.preventDefault();
    var email = this.state.email,
        password = this.state.password,
        name = this.state.name,
        self = this;

    if(!email || !password || !name) return;

    qwest.post('/register', {
        email: email,
        name: name,
        password: password,
     })
     .then(function(xhr, response) {
        
        if(response.message){
          self.setState({error: true, errorMessage: response.message});
        }

        if(response.redirect){
          window.location = '/'
        }

     })
     .catch(function(xhr, response, e) {
        
     });    
  }
  onRegisterEmailChange(e) {
    if(this.state.error) this.dropErrorMessage()
    this.setState({email: e.target.value});    
  }
  onRegisterNameChange(e) {
    if(this.state.error) this.dropErrorMessage()
    this.setState({name: e.target.value});      
  }
  onRegisterPasswordChange(e) {
    if(this.state.error) this.dropErrorMessage()
    this.setState({password: e.target.value});         
  }
  onLoginEmailChange(e) {
    if(this.state.error) this.dropErrorMessage()
    this.setState({email: e.target.value});
  }
  onLoginPasswordChange(e) {
    if(this.state.error) this.dropErrorMessage()
    this.setState({password: e.target.value})
  }
  showError(){
    return  <Panel header="Произошла ошибка" bsStyle="danger">
              {this.state.errorMessage}
            </Panel>
  }
  dropErrorMessage() {
    this.setState({
      error: false,
      errorMessage: ''
    })
  }
  onTabSelect(key) {
    this.setState({key: key, error: false, errorMessage: ''});
  }
  render() {
    return <Grid> 
            <Row>
              <Col lg={12}>
                  <h1>Time tracker</h1>
                  <Tabs defaultActiveKey={this.state.key} activeKey={this.state.key} onSelect={this.onTabSelect.bind(this)}>
                    <Tab eventKey={1} title="Авторизация">
                      <h3>Авторизуйтесь или войдите через Вконтакте</h3>
                      <a href="/auth/vkontakte">
                        Войти через Вконтакте
                      </a>
                      <hr />
                      { this.state.error ? this.showError() : null }
                      <form onSubmit={this.onLoginSubmit.bind(this)}>
                        <Input onChange={this.onLoginEmailChange.bind(this)} value={this.state.email} name="email" type="email" label="Email Адресс" placeholder="Введите email" />
                        <Input onChange={this.onLoginPasswordChange.bind(this)} value={this.state.password} name="password" type="password" label="Пароль" placeholder="Введите пароль" />
                        <ButtonInput type="submit" value="Войти" />
                      </form>
                    </Tab>
                    <Tab eventKey={2} title="Регистрация">
                      <h3>Зарегестрируйтесь</h3>
                      { this.state.error ? this.showError() : null }
                      <form onSubmit={this.onRegisterSubmit.bind(this)}>
                        <Input onChange={this.onRegisterEmailChange.bind(this)} value={this.state.email}  name="email" type="email" label="Email Адресс" placeholder="Введите email" />
                        <Input onChange={this.onRegisterNameChange.bind(this)} value={this.state.name} name="name" type="text" label="Имя" placeholder="Введите имя" />
                        <Input onChange={this.onRegisterPasswordChange.bind(this)} value={this.state.password} name="password" type="password" label="Пароль" placeholder="Введите пароль" />
                        <ButtonInput type="submit" value="Зарегестрироваться" />
                      </form>
                    </Tab>
                  </Tabs>
              </Col>
            </Row>
           </ Grid>
  }
}

ReactDOM.render(<Login  />, document.getElementById('login'));
