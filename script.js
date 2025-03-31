window.expenseChart = null;


document.getElementById("numOfPeople").addEventListener("input",function(){
let numPeople = parseInt(this.value);
let container = document.getElementById("inputContainer");

container.innerHTML = "";
if( numPeople >0 ){
    for(let i = 0;i<numPeople;i++){
        let nameInput = document.createElement("input");

    nameInput.type = "text";
        nameInput.placeholder=`enter the name of ${i+1} person`;
        nameInput.classList.add("border-2","border-blue-500","p-2", "pb-2","nameInput");

        let amountInput = document.createElement("input");

        amountInput.type = "number";
        amountInput.placeholder = `enter the amount of ${i+1} person`;
        amountInput.classList.add("border-2","border-blue-500","p-2","pb-2", "amountInput");

        container.appendChild(nameInput);
        container.appendChild(amountInput);
        container.appendChild(document.createElement("br"));

    }

    let calculatebtn = document.createElement("button");

    calculatebtn.textContent = "Calculate";
    calculatebtn.classList.add("bg-blue-500","text-white","p-2", "pt-2","rounded-md")

    calculatebtn.addEventListener("click",calculateExpense);

    container.appendChild(calculatebtn);

    let resultDiv = document.createElement("div");
    resultDiv.id = "result";
    resultDiv.classList.add("text-xl","font-bold")
    container.appendChild(resultDiv);

}
});

function calculateExpense() {
    let names = document.querySelectorAll(".nameInput");
    let amounts = document.querySelectorAll(".amountInput");

    let totalAmount = 0;
    let people = [];

    amounts.forEach( (input , index) => {
        let name = names[index].value || `person ${index+1}`;
        let amountpaid  = parseFloat(input.value)||0;

        people.push({name,amountpaid});
        totalAmount +=amountpaid;
        
        });
        
    let numPeople = amounts.length;
    let perPersonShare =  (numPeople>0) ? (totalAmount/numPeople).toFixed(2) : 0;
    
    let debators = [];
    let creditors = [];

    people.forEach(person =>{

        let balance  =(person.amountpaid-perPersonShare).toFixed(2);
        if (balance>0) {
            creditors.push({name: person.name,  amount: balance});
        }
        else if (balance<0) {
            debators.push({name: person.name, amount: -balance});
        }
    });

    let transactions = [];

    while(debators.length>0 && creditors.length>0){
        let debator = debators[0];
        let creditor= creditors[0];

        let amountPay = Math.min(debator.amount,creditor.amount);
        
        transactions.push(`${debator.name} owes $ ${amountPay} to ${creditor.name}`);

        debator.amount -= amountPay;
        creditor.amount -= amountPay;

        if(debator.amount ===0){
            debators.shift();
        }
        if (creditor.amount === 0){
            creditors.shift();
        }
    }
    let resultText = `<p>Total: ₹${totalAmount}</p>`;
    resultText += `<p>Each person should pay: ₹${perPersonShare}</p>`;
    resultText += transactions.length > 0 ? "<p>Transactions:</p>" + transactions.map(t => `<p>${t}</p>`).join("") : "<p>Everyone has paid their share!</p>";

    document.getElementById("result").innerHTML = resultText;

    generateChart(people);
   
}

function generateChart(people) {
    let ctx = document.getElementById("expenseChart").getContext("2d");

    
    if (window.expenseChart instanceof Chart) {
        window.expenseChart.destroy();
    }

    let names = people.map(person => person.name);
    let amounts = people.map(person => person.amountpaid); 

    window.expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: names,
            datasets: [{
                data: amounts,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"]
            }]
        }
    });
}



