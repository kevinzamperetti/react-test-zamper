import React, { Component, Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import MaskedInput from 'react-text-mask';
import { Redirect } from 'react-router';

import {
    Form,
    FormGroup,
    FormText,
    Input,
    CustomInput,
    Button,
	Label,
	Media,
    EmptyLayout,
	ThemeConsumer,
	UncontrolledModal,
	ModalBody,
	ModalHeader,
    ModalFooter
} from './../../../components';

import { HeaderAuth } from "../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../components/Pages/FooterAuth";

import Util from '../../../components/Util/Util';
import API from '../../../services/api';

export default class Register extends Component {
    constructor( props ) {
		super( props )
		this.util = new Util();
        this.state = {
			name: '',
			email: '',
			password: '',
			repeatPassword: '',
			profileSelector: 'EXTERNAL',
			documentNumber: '',
			bankIdSelector: '',
			bankAgency: '',
			bankAccount: '',
			listBanks: []
		}
	}

	componentDidMount() {
		this.listAllBanks()
	}	

	listAllBanks = async () => {
		const response = await API.get( '/bankData' )
		this.setState( { listBanks: response.data }  )
	}

	changeValuesStateBank( evt ) {
		let { listBanks } = this.state
		let { name } = evt.target
		const itemID = evt.target.value
		const res = listBanks.find( p => p.id == itemID )
		this.setState( { 
						[name] : res
		} )
	}

	changeValuesState( evt ) {
		const { name, value } = evt.target
		// this.validarEmail( evt )
		this.setState( {
			[name]: value
		})
	}

	register( evt ) {
		evt.preventDefault();
		const { name, email, password, repeatPassword, profileSelector, documentNumber, 
				bankIdSelector, bankAgency, bankAccount } = this.state
		if (password != repeatPassword) {
			toast.error(this.util.contentError('Senhas informadas são diferentes!'));
		} else if ( name && email && password && profileSelector && documentNumber &&
			        bankIdSelector && bankAgency && bankAccount ) {
			API.post( '/user/register', {
				name: name,
				email: email,
				password: password,
				profile: profileSelector.toUpperCase(),
				isCollaborator: false,
				documentNumber: documentNumber,
				bankData: {
					id: bankIdSelector
				},
				bankAgency: bankAgency,
				bankAccount: bankAccount
			} ).then( response => {
				toast.success(this.util.contentSuccess());
				// console.log( response.data )
				this.setState({redirect: true})
			})
			.catch( error => {
                toast.error(this.util.contentError(error.response.data.message));
            } )
		} else {
			toast.error(this.util.errorFillFields());
		}
	}
    
    render() {
		const { listBanks } = this.state
		if(this.state.redirect) {
			return (
				<Fragment>
					<Redirect to="/pages/login/" />
				</Fragment>
			)
		} else {
			return (
				<EmptyLayout>
					<EmptyLayout.Section center width={ 480 }>
						<HeaderAuth title="Criar Conta"/>
						<Form className="mb-3" onChange={ this.changeValuesState.bind( this ) } onSubmit={ this.register.bind( this ) } >
							<FormGroup>
								<Label for="name">Nome</Label>
								<Input type="text" name="name" id="name" placeholder="Nome..." className="bg-white" />
							</FormGroup>
							<FormGroup>
								<Label for="emailAdress">E-mail</Label>
								<Input type="text" name="email" id="emailAdress" placeholder="Informe seu e-mail..." className="bg-white" />
								<FormText color="muted">
									Nós nunca compartilharemos seu email com mais ninguém.
								</FormText>
							</FormGroup>
							<FormGroup>
								<Label for="password">Senha</Label>
								<Input type="password" name="password" id="password" placeholder="Senha..." className="bg-white" />
							</FormGroup>
							<FormGroup>
								<Label for="repeatPassword">Repetir Senha</Label>
								<Input type="password" name="repeatPassword" id="repeatPassword" placeholder="Password..." className="bg-white" />
							</FormGroup>
							<FormGroup>
								<Label for="profileSelector">Perfil</Label>
								<CustomInput type="select" name="profileSelector" id="profileSelector">
									<option value="EXTERNAL" selected>Externo</option>
								</CustomInput>
							</FormGroup>
							<FormGroup>
								<Label for="documentNumber">CPF</Label>
								<Input
									mask={ [/\d/, /\d/,  /\d/, '.', /\d/,  /\d/, /\d/, '.',  /\d/, /\d/, /\d/, '-', /\d/, /\d/] }
									keepCharPositions={ true }
									// pipe="000.000.000-00"
									placeholder='Informe seu CPF...'
									tag={ MaskedInput }
									name="documentNumber"
									id="documentNumber"
								/>
							</FormGroup>
							<FormGroup>
								<Label for="bankIdSelector">Banco</Label>
								<CustomInput type="select" name="bankIdSelector" id="bankIdSelector" onChange={ this.changeValuesStateBank.bind( this ) } >
									<option value="" selected>Selecione seu banco...</option>
									{ listBanks.length > 0 ?
										<React.Fragment>
											{ listBanks.map( ( bank ) => { 
												return(
													<option key={bank.id} id={ bank.id } value={ bank.id } onChange={ this.changeValuesStateBank.bind( this ) }>{ bank.number +"-"+ bank.name }</option>
												)
											} ) }
										</React.Fragment>
									:
										<option value="Não existe uma lista de bancos cadastrada">Não existe uma lista de bancos cadastrada</option>
									}
								</CustomInput>
							</FormGroup>
							<FormGroup>
								<Label for="bankAgency">Número da Agência</Label>
								<Input type="number" name="bankAgency" id="bankAgency" placeholder="Número da Agência..." className="bg-white" />
							</FormGroup>
							<FormGroup>
								<Label for="bankAccount">Número da Conta <span className="small ml-1 text-muted">(com dígito)</span></Label>
								<Input type="text" name="bankAccount" id="bankAccount" placeholder="Número da Conta..." className="bg-white" />
							</FormGroup>
							<ThemeConsumer>
							{
								({ color }) => (
									<Button color={ color } block >Criar Conta</Button>
								)
							}
							</ThemeConsumer>
						</Form>
						<div className="d-flex mb-5">
							<Link to="/pages/login" className="ml-auto text-decoration-none">Login</Link>
						</div>
						<FooterAuth />
					</EmptyLayout.Section>
					<ToastContainer 
                    position='top-right'
                    autoClose={3000}
                    draggable={false}
                    hideProgressBar={true}
                    />
				</EmptyLayout>
			)
		}
    }
}
