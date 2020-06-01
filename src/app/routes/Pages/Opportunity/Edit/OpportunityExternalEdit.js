import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import MaskedInput from 'react-text-mask';
import Toggle from 'react-toggle';
import moment from 'moment';
import { HeaderDemo } from "../../../components/HeaderDemo";
import { 
    Button, Container, Row, Col, Card, CardBody, CardFooter, CustomInput, 
    Form, FormText, FormGroup, Label, Media, Input
} from '../../../../components';
import Util from '../../../../components/Util/Util';
import API from '../../../../services/api';

export default class OpportunityExternalEdit extends Component {
    constructor( props ) {
        super( props )
        this.util = new Util();
        this.state = {
			name: '',
			description: '',
            campaignIdSelector: '',
            opportunityBonusLevelIdSelector: '',
            experienceLevelSelector: '',
            expirationDate: '',
            automaticEvaluationQuantity: '',
            enabled: false,
            listCampaign: '',
            listOpportunityBonusLevel: '',
            opportunity: '',
            campaign: '',
            bonusLevel: ''
		}
    }

    componentDidMount() {
        this.listIndicationById();
        this.listAllCampaigns();
        this.listAllOpportunityBonusLevel();
    }	
    
    listIndicationById = async () => {
        const { id } = this.props.match.params
		const header = { headers: {Authorization: localStorage.getItem('Authorization') } }
        const response = await API.get( `/opportunity/${id}`, header )
        this.setState( { 
            opportunity: response.data,
            campaign: response.data.campaign,
            bonusLevel: response.data.bonusLevel,
            enabled: response.data.enabled,
            name: response.data.name,
            description: response.data.description,
            campaignIdSelector: response.data.campaign,
            opportunityBonusLevelIdSelector:response.data.bonusLevel,
            experienceLevelSelector: response.data.experienceLevel,
            expirationDate: moment( response.data.expirationDate, 'YYYY-MM-DD',true).format('DD/MM/YYYY'),
            automaticEvaluationQuantity: response.data.automaticEvaluationQuantity
         }  )
    }

    listAllCampaigns = async () => {
		const header = { headers: {Authorization: localStorage.getItem('Authorization') } }
		const response = await API.get( '/campaign', header )
		this.setState( { listCampaign: response.data }  )
	}

    listAllOpportunityBonusLevel = async () => {
		const header = { headers: {Authorization: localStorage.getItem('Authorization') } }
		const response = await API.get( '/opportunityBonusLevel', header )
		this.setState( { listOpportunityBonusLevel: response.data }  )
    }
    
    getListExperienceLevel(experienceLevel){
        if (experienceLevel === "JUNIOR") {
            return "Junior"
        } else if (experienceLevel === "PLENO") {
            return "Pleno"
        } else if (experienceLevel === "SENIOR") {
            return "Senior"
        }
    }

    render() {
        const { opportunity, campaign, bonusLevel, listCampaign, listOpportunityBonusLevel } = this.state
        return (
            <React.Fragment>
                <Container>
                    <Row> 
                        <Col lg={ 12 }>
                            <HeaderDemo 
                                no=''
                                title={'Oportunidade ' + opportunity.name}
                                subTitle=""
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={ 12 }>
                            <Card className="mb-3">
                                <CardBody>
                                    <Form>
                                        <FormGroup row>
                                            <Label for="input" sm={3}>
                                                Nome
                                            </Label>
                                            <span>{opportunity.name}</span>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="description" sm={3} style={{padding: "0px 0px 0px 15px"}}>
                                                Descrição
                                            </Label>
                                            <Col sm={9} style={{padding: "0"}}>
                                                <Input 
                                                    type="textarea" 
                                                    rows="10"
                                                    name="description" 
                                                    style={{border: "none", backgroundColor: "#FFFFFF", color:"#8493A5", padding: "0"}}
                                                    id="description" 
                                                    defaultValue={opportunity.description}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="experienceLevelSelector" sm={3}>Nível de Experiência</Label>
                                            <span>{this.getListExperienceLevel(opportunity.experienceLevel)}</span>
                                        </FormGroup>                                        
                                        <FormGroup row>
                                            <Label for="campaignIdSelector" sm={3}>Campanha de Indicação</Label>
                                            <span>{campaign.name}</span>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="opportunityBonusLevelIdSelector" sm={3}>Nível de Bonificação</Label>
                                            <span>{bonusLevel.name}</span>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="input" sm={3}>
                                                Data de Expiração
                                            </Label>
                                            <span>{ moment(opportunity.expirationDate, 'YYYY-MM-DD', true).format('DD/MM/YYYY') }</span>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="input" sm={3}>
                                                Quantidade de Avaliação automática 
                                            </Label>
                                            <span>{opportunity.automaticEvaluationQuantity}</span>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="input" sm={3}>
                                                Ativo
                                            </Label>
                                            <Col sm={9}>
                                                <Toggle
                                                    checked={ this.state.enabled }
                                                    name='enabled'
                                                    value='true'
                                                    readOnly/>
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <ToastContainer 
                        position='top-right'
                        autoClose={3000}
                        draggable={false}
                        hideProgressBar={true}
                    />
                </Container>
                <CardFooter className="mt-4 mb-2 p-8 bt-0">
                    <div className="d-flex">
                        <Button onClick={this.util.goPreviousPage.bind(this)} color="link" className='mr-3'>
                            <i className='fa fa-angle-left mr-2'></i>
                            Voltar
                        </Button>
                    </div>
                </CardFooter>
            </React.Fragment>
        )
    }
}