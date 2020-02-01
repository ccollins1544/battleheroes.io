
// function used to send to one user via the google smtp server
function sendEmail() {
  Email.send({
    Host: "smtp.gmail.com",
    Username: "battleheroeemail@gmail.com",
    Password: "<email password>",
    To: "<recipient’s email address>",
    From: "battleheroeemail@gmail.com",
    Subject: "<email subject>",
    Body: "<email body>"
  }).then(message => alert("mail sent successfully"));
}

module.exports = sendEmail;




// This function can be used to send to multiple recipients
//function sendEmail() {
//	Email.send({
//	Host: "smtp.gmail.com",
//	Username : "Your Gmail Address",
//	Password : "Your Gmail Password",
//	To : 'recipient_1_email_address, recipient_2_email_address',
//	From : "sender’s email address",
//	Subject : "email subject",
//	Body : "email body",
//	}).then(
//		message => alert("mail sent successfully")
//	);
//}


// full code for simple call using js to send emails
//<!DOCTYPE html>
//<html>
//<head>
//	<title></title>
//	<script src="https://smtpjs.com/v3/smtp.js"></script>  
//	<script type="text/javascript">
//		function sendEmail() {
//			Email.send({
//				Host: "smtp.gmail.com",
//				Username : "<sender’s email address>",
//				Password : "<email password>",
//				To : '<recipient’s email address>',
//				From : "<sender’s email address>",
//				Subject : "<email subject>",
//				Body : "<email body>",
//			})
//			.then(function(message){
//				alert("mail sent successfully")
//			});
//		}
//	</script>
//</head>
//<body>  
//	<form method="post">
//		<input type="button" value="Send Email" onclick="sendEmail()"/>
//	</form>  
//</body>
//</html>