let ip,time,arr=[],hostname;
let latitude = document.getElementById('latitude');
let longitude = document.getElementById('longitude');
let city = document.getElementById('city');
let org = document.getElementById('org');
let reg = document.getElementById('reg');
let host = document.getElementById('host');
let zone = document.getElementById('zone');
let date = document.getElementById('date');
let pincode = document.getElementById('pincode');
let msg = document.getElementById('msg');
let pin = '';
let cards = document.getElementById('cards');
let filter = document.getElementById('filter');


function displaymap(latitude,longitude){ //show the map
    let url = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;
    let iframe = document.createElement('iframe');

    iframe.setAttribute('src',url);
    document.getElementById('thisdata').appendChild(iframe);
 }

function nextPage(){ //second page
    document.getElementById('first').style.display = 'none';
    document.getElementById('second').style.display = 'block';

    document.getElementById('heading2').innerText += ip;
    fetchData();
}
 
function getIP(){ //get the random ip address
    $.getJSON("https://api.ipify.org?format=json", function(data) {//get ip address

    ip=data.ip; //save the id address in global variable ip
    document.getElementById('heading1').innerText += data.ip; //attach the accessing ip address to the heading
    console.log(data.ip);
})
}
getIP();

async function fetchData(){ //get json data for the ip gotten previously

    await fetch(`https://ipinfo.io/${ip}?token=7b68711d7a402d`)
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        let locArr = data.loc.split(',');

        org.innerText += ' '+data.org;
        reg.innerText += ' '+data.region;
        city.innerText += ' '+data.city;
        pincode.innerText += ' '+data.postal;
        zone.innerText += ' '+data.timezone;
        latitude.innerText += ' '+locArr[0];
        longitude.innerText += ' '+locArr[1];
        host.innerText += ' '+hostname;

        displaymap(locArr[0],locArr[1]);
        pin += data.postal;
        date.innerText += new Date().toLocaleString("en-IN", { timeZone: `${data.timezone}` });//get date and time of the zone of ip address

        // "3/22/2021, 5:05:51 PM"
        console.log(`pincode here iss:${pin}`);
    })
    .catch((e)=>{
        console.log(e);
    });

   postal();
}

function postal(){
    
    console.log(`pincode iss:${pin}`);
    fetch(`https://api.postalpincode.in/pincode/${pin}`) //get the pincode areas matching the postal code of JSON data
    .then((response)=>response.json())
    .then((data)=>{
        showData(data);
    })
    .catch((e)=>console.log(e));
}

function showData(data){ //get data and show it on screen
    data.forEach(element => {
        msg.innerText += element.Message;
        console.log(data);

        data.forEach(element=>{
            element.PostOffice.forEach(item => {
                arr.push(item);

                cards.innerHTML += `
                <div id="container">
                    <p id="name">Name: ${item.Name}</p>
                    <p id="branch">Branch Type: ${item.BranchType}</p>
                    <p id="status">Delivery Status: ${item.DeliveryStatus}</p>
                    <p id="dist">District: ${item.District}</p>
                    <p id="div">Division: ${item.Division}</p>
                </div>`
            });
    });
});
}

console.log(arr);
let sort = document.getElementById('sort');

filter.addEventListener('input',()=>{ //searching and filtering accordingly
    let newArray;

    if(sort.value=='Name') { //filter by name
        newArray = arr.filter((array)=>{
            return array.Name.toLowerCase().includes(filter.value.trim().toLowerCase());
        });
    }
    else if(sort.value=='branchoffice') { //filter by branch office
        newArray = arr.filter((array)=>{
            return array.BranchType.toLowerCase().includes(filter.value.trim().toLowerCase());
        });
    }
    else if(sort.value=='' || filter.value=='') { //default filtering
            return newArray = arr;
    }
    console.log(newArray);
    getData(newArray);
})

function getData(newArray){ //filtering data based on the data entered in search bar
    cards.innerHTML = '';
    newArray.forEach((item)=>{
        cards.innerHTML += `
        <div id="container">
            <p id="name">Name: ${item.Name}</p>
            <p id="branch">Branch Type: ${item.BranchType}</p>
            <p id="status">Delivery Status: ${item.DeliveryStatus}</p>
            <p id="dist">District: ${item.District}</p>
            <p id="div">Division: ${item.Division}</p>
        </div>`
    });
}
