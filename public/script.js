async function printf() {
 

  document.getElementById('username-field').style.display = 'none';
  document.getElementById('password-field').style.display = 'none';
  document.getElementById('sap-field').style.display = 'none';
                
                // Hide forget fields, if shown
  document.getElementById('forget-fields').style.display = 'none';
              
                // Show the signup fields
  document.getElementById('signup-fields').style.display = 'block';

  const name = document.getElementById('name').value;
  const number = document.getElementById('number').value;
  const sapid = document.getElementById('sapid').value;
  const email = document.getElementById('email').value;
  const pass = document.getElementById('pass').value;

if(name != ""){
  const data = {
    Name:name,
    Contact:number,
    SAP:sapid,
    Email:email,
    Password:pass
  };

  try{
    const response = await fetch('/signup',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
      alert("Sign up failed")
    }
    else{
      alert("sign up sucess")
      const result = await response.json();
      console.log(result)
      document.getElementById('signup-fields').style.display = 'none';
      document.getElementById('forget-fields').style.display = 'none';
              
      // Show the login fields (Username and Password)
      document.getElementById('username-field').style.display = 'flex';
      document.getElementById('password-field').style.display = 'flex';
      document.getElementById('sap-field').style.display = 'flex';
      document.getElementById('btn2').style.display = 'none';
     
    }
   
  }
  catch(err){
    console.log('Error has occured')
  }
}
  
}


async function ulog(){
  const email = document.getElementById('email_login').value;
  const pass = document.getElementById('pass_login').value;
  const sapid = document.getElementById('sap').value;
  

  document.getElementById('signup-fields').style.display = 'none';
  document.getElementById('forget-fields').style.display = 'none';

  // Show the login fields (Username and Password)
  document.getElementById('username-field').style.display = 'flex';
  document.getElementById('password-field').style.display = 'flex';
  document.getElementById('sap-field').style.display = 'flex';



if(email != ""){
  const data = {
    Email:email,
    Password:pass,
    SAP:sapid
   
  }

  try{
    const response = await fetch('/login',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    })

    if(response.ok == false){
      alert("Log In failed");
    }
    else{
      alert("Log In sucess");
      const result = await response.text(); 
      localStorage.setItem('Token',result);
      console.log(localStorage.getItem('Token'));

      document.getElementById('Login').style.display = 'none';
      document.getElementById('login').style.display = 'none';
      document.getElementById('Profile').style.display = 'block';
      document.getElementById('psap').innerHTML = sapid;
      document.getElementById('pemail').innerHTML = email;

      const formWrapper = document.querySelector('.form-wrapper');
      const contentWrapper = document.getElementById('page-wrapper');

      formWrapper.style.display = 'none';
      contentWrapper.classList.remove('blur-background'); 

      
    
     
    }

   
  
  }
  catch(err){
    console.log(err)
  }
}
 
}

async function regi(){

  const token = localStorage.getItem('Token');
  try{
    const response = await fetch('/register', {
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + token, 
          'Content-Type': 'application/json'
      }
    })
    if(response.ok == false){
      alert("Register for event failed");
    }
    else{
      alert("Register for event sucess");
      console.log("register sucess")
    }
    const result = await response.text();
    
   
    console.log(result); 
  }
  catch(err){
   
    console.log(err);
  }
}
