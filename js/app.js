// Dont pullute global namespace.
(function(){


function $(id){
	return document.getElementById(id);
}


function App(){
	this.view = new View();
}

function View(){
	this.render();
}

function Web(){
	this.base = "https://respot-dahnny012.c9users.io";
}

View.prototype.start=function(){
	var self = this;
	this.render("Checking if you are logged in.");
	web.loggedIn().then(function(error,text,xhr){
		if(error){
			self.error();
			return;
		}
		var res = JSON.parse(text);
		console.log(res);
		if(res.success)
			self.home();
		else
			self.logIn();
	})
}

View.prototype.logIn=function(){
	this.render(
		"Please Log In",
		"<input id = 'user' type='text'><br><input id='pass' type='password' name='password'> \
		<br> \
		<input type='button' id='submit' value='Login'>");
		
		var self = this;
		
		setTimeout(function(){
			// Lol gloabals
			document.getElementById("submit").onclick=function(){
					var user = $("user").value;
					var pass = $("pass").value;
					
					web.login({user:user,pass:pass}).then(function(err,text,xhr){
						if(err){
							self.loginError()
						}
							else{
								self.home();
							}
					})
			}
		});
}

View.prototype.home = function(){
	// Just gets a list of decks.
	var self = this;
	
	// TODO Check before a redraw.
	web.decks().then(function(err,text,xhr){
		var res = JSON.parse(text);
		// TODO Turn this list of decks into a option list later.
			var select = function(id,str){
			return "<option value='"+id+"'>"+str+"</option>";
		}
		// Creates a select options for the decks
		console.log(res);
		var decks = "<select id='decks'>"+res.map(function(e){return select(e._id,e.name); }).join("")+"</select>";
		
		// Creates the card input
		var cardInput = "<textarea rows='4' cols='50' id='front'></textarea><br>\
		<textarea rows='4' cols='50' id='back'></textarea>\
		<br><input value='Add Card' type='button' id='card-submit'>";
		self.render("Your decks",decks+"<br>"+cardInput);
		
		// Attach the event handler.
		setTimeout(function(){
			// When the user clicks submit
			document.getElementById("card-submit").onclick=function(){
				var target = $( "decks" );
				var id = target.options[ target.selectedIndex ].value;
				var data = {front:$("front").value,back:$("back").value}
				web.addCard(id,data).then(function(){
					// Clear the cards.
					$("front").value = "";
					$("back").value = "";
				})
			}
		})
	})
}


View.prototype.error = function(){
	this.render("An Error has occured. Try reloading the extension");
}

View.prototype.loginError = function(){
	this.render("A Login Error has occured. Try again")
}

View.prototype.render=function(status,html){
	status = status || "";
	html = html || "";
	
	if(status !== "")
		$("status").innerText = status;
	if(html !== "")
		$("content").innerHTML = html;
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

Web.prototype.addCard = function(id,data){
	var self = this;
	return promise.post(self.base+"/deck/add/"+id,data)
}




var app = new App();
var web = new Web();
app.init();
})()