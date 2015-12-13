import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Tabs, Tab, Input, ButtonInput} from 'react-bootstrap';

require("./styles/bootstrap.css");

export default class App extends React.Component {
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
                      <form action="/login" method="post">
                        <Input name="email" type="email" label="Email Адресс" placeholder="Введите email" />
                        <Input name="password" type="password" label="Пароль" placeholder="Введите пароль" />
                        <ButtonInput type="submit" value="Войти" />
                      </form>
                    </Tab>
                    <Tab eventKey={2} title="Регистрация">
                      <h3>Зарегестрируйтесь или войдите через Вконтакте</h3>
                    </Tab>
                  </Tabs>
              </Col>
            </Row>
           </ Grid>
  }
}

ReactDOM.render(<App  />, document.getElementById('login'));
