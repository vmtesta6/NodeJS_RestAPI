// Userlist array for filling in info box
var UserListData = [];

// DOM Ready
$(document).ready(function() {
	// Populate the user table on initial page load
	populateTable();
	
	//Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#btnAddUser').on('click', addUser);
	
	//Delete a user
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});


// Functions

// Fill table with data
function populateTable() {

	var tableContent = '';
	
	// jQuery AJAX call for JSON
	$.getJSON('/users/userlist', function(data) {
		UserListData = data;
		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});
		
		$('#userList table tbody').html(tableContent);
	});
};


// Show User Info
function showUserInfo(event) {
	// Prevent link from firing
	event.preventDefault();
	
	// Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');
	
	// Get Index of object based on id value
	var arrayPosition = UserListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
	
	var thisUserObj = UserListData[arrayPosition];
	
	//Populate Info Box
	$('#userInfoName').text(thisUserObj.fullname);
	$('#userInfoAge').text(thisUserObj.age);
	$('#userInfoGender').text(thisUserObj.gender);
	$('#userInfoLocation').text(thisUserObj.location);
};

// Add User
function addUser(event) {
	event.preventDefault();
	
	//Basic validation for empty fields
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});
	
	// Check and make sure errorCount's still at zero
	if(errorCount === 0) {
		// If no errors, compile all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullName').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}
		
		//Post the object to the adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON',
		}).done(function(response) {
			//Check for blank(successful) response
			if(response.msg === '') {
			
				//Clear form inputs
				$('#addUser fieldset input').val('');
				
				//Update the table
				populateTable();
			} else {
				//If the add had an error, report to the user the error returned by the service
				alert('Error: '+response.msg);
			}
		});
	} else {
		alert('Please fill up all the fields');
		return false;
	}
};


//Delete User
function deleteUser(event) {
	event.preventDefault();
	
	//Confirmation
	var confirmation = confirm('Are you sure you want to delete this user?');
	
	if (confirmation === true) {
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
			}).done(function(response) {
				// Check for a blank(successful) response
				if (response.msg === '') {
				} else {
					alert('Error :'+response.msg);
				}
				//Update the table
				populateTable();
			});
	} else {
		return false;
	}
};