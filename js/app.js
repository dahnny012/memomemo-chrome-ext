// Dont pullute global namespace.
(function(){

function App(){
	this.view = new View();
}

function View(){
	this.web = new Web();
	this.render();
}

function Web(){
	this.base = "https://respot-dahnny012.c9users.io";
}

View.prototype.start=function(){
	var self = this;
	this.render("Checking if you are logged in.");
	this.web.loggedIn().then(function(error,text,xhr){
		var res = JSON.parse(text);
		if(res.success)
			self.home();
		else
			self.logIn();
	})
}

View.prototype.logIn=function(){
	this.render(
		"Please Log In",
		"<input type='text' name='username'><br><input type='text' name='password'> \
		<br> \
		<input type='button' id='submit' value='Login'>");
		
		//TODO  Set Event Handler
}

View.prototype.home = function(){
	// Just gets a list of decks.
	var self = this;
	this.web.decks().then(function(err,text,xhr){
		var res = JSON.parse(text);
		// TODO Turn this list of decks into a option list later.
		var decks = text.map(function(e){return e.name}).join("<br>");
		self.render("Your decks",decks);
	})
}

View.prototype.render=function(status,html){
	status = status || "";
	html = html || "";
	
	if(status !== "")
		document.getElementById("status").innerText = status;
	if(html !== "")
		document.getElementById("content").innerHTML = html;
}



App.prototype.init=function(){
	this.view.start();
}

Web.prototype.loggedIn=function(){
	var self = this;
	return promise.get(self.base+"/api/loggedIn");
}

Web.prototype.login = function(data){
	var self=this;
	return promise.post(self.base+"/user/login",data);
}

Web.prototype.decks=function(){
	var self = this;
	return promise.get(self.base+"/api/decks");
}




var app = new App();
app.init();
})()