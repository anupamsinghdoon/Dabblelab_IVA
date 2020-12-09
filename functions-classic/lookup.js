exports.handler = function(context, event, callback) {
	
	let response = {NameSpace:"",ClientName:"",WebPaymentAddress:"",MailingAddress:"",Host:"",TransferAgentNumber:"",ErrorMessage:""};

	var TFN = event.Tfn;
	
	if (event.Tfn === undefined)
	{
	    response.ErrorMessage="we are not getting tfn";
	}

	if(TFN === "+17542199132")
	{
	    response.NameSpace="RED";
	    response.ClientName="Dish Network";
	    response.WebPaymentAddress="dish.com";
	    response.MailingAddress="Dish Network Palatine IL 60055-0063";
	    response.Host="FACS";
	    response.TransferAgentNumber="+15005550001";
	    
	}
	
	else if(TFN === "+14252766034")
	{
	    response.NameSpace="RED";
	    response.ClientName="Convergent Outsourcing Incorporated";
	    response.WebPaymentAddress="payconvergent.com";
	    response.MailingAddress="Convergent Outsourcing Incorporated, P O Box 9004 Renton Washington 98057-9004";
	    response.Host="FACS";
	    response.TransferAgentNumber="+15005550001";
	    
	}
	
	else if(TFN === "+18003325078")
	{
	    response.NameSpace="RED";
	    response.ClientName="Convergent Outsourcing Incorporated";
	    response.WebPaymentAddress="www.payconvergent.com";
	    response.MailingAddress="Convergent Outsourcing Incorporated PO Box 9004 Renton Washington 98057-9004";
	    response.Host="FACS";
	    response.TransferAgentNumber="+15005550001";
	    
	}
	
	else if(TFN === "+18003351881")
	{
	    response.NameSpace="CBA";
	    response.ClientName="Convergent Healthcare Recovery Incorporated";
	    response.WebPaymentAddress="www.chr.estatement.com";
	    response.MailingAddress="Convergent Healthcare Recovery Incorporated PO Box 6209 Department 0102 Champaigne Illinois 61826-6209";
	    response.Host="FACS";
	    response.TransferAgentNumber="+15005550001";
	    
	}
	
	else if(TFN === "+18003509095")
	{
	    response.NameSpace="RED";
	    response.ClientName="Convergent Outsourcing Incorporated";
	    response.WebPaymentAddress="www.payconvergent.com";
	    response.MailingAddress="Convergent Outsourcing Incorporated PO Box 9004 Renton Washington 98057-9004";
	    response.Host="FACS";
	    response.TransferAgentNumber="+15005550001";
	    
	}
	
	else if(TFN === "+18004043086")
	{
	    response.NameSpace="SON";
	    response.ClientName="Convergent Outsourcing Incorporated";
	    response.WebPaymentAddress="www.payconvergent.com";
	    response.MailingAddress="Convergent Outsourcing Incorporated PO Box 9004 Renton Washington 98057-9004";
	    response.Host="FACS";
	    response.TransferAgentNumber="+15005550001";
	    
	}
	else
	{
	    response.ErrorMessage="somthing went wrong ";
	    
	}
	

	
	callback(null, response);
};