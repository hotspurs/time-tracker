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
    password: ''
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
  dropErrorMessage(){
    this.setState({
      error: false,
      errorMessage: ''
    })
  }
  render() {
    return <Grid> 
            <Row>
              <Col lg={12}>
                  <h1>Time tracker</h1>
                  <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Авторизация">
                      <h3>Авторизуйтесь или войдите через Вконтакте</h3>
                      <a href="/auth/vkontakte">
                        Войти через Вконтакте
                      </a>
                      <hr />
                      { this.state.error ? this.showError() : null }
                      <form onSubmit={this.onLoginSubmit.bind(this)}>
                        <Input onChange={this.onLoginEmailChange.bind(this)} name="email" type="email" label="Email Адресс" placeholder="Введите email" />
                        <Input onChange={this.onLoginPasswordChange.bind(this)} name="password" type="password" label="Пароль" placeholder="Введите пароль" />
                        <ButtonInput type="submit" value="Войти" />
                      </form>
                    </Tab>
                    <Tab eventKey={2} title="Регистрация">
                      <h3>Зарегестрируйтесь</h3>
                    </Tab>
                  </Tabs>
              </Col>
            </Row>
           </ Grid>
  }
}

ReactDOM.render(<Login  />, document.getElementById('login'));
