//Selecionando os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")


//Selecionado os elementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")


//Captura o input para formatar o valor
amount.oninput = () => {
    //Obtém o valor atual  do input e remove letras
    let value = amount.value.replace(/\D/g, "")

    //Transformando o valor em centavos
    value= Number(value) / 100

    //Atualizando o valor do input
    amount.value = formatCurrencyBRL(value)
}


function formatCurrencyBRL(value){
    //Formatando o valor do input 
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

//Captura o evento de submit do formulário para obter valores

form.onsubmit = (event)=>{
    event.preventDefault()

    //Criando Objeto com detalhes da despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        create_at: new Date(),

    }
    //Chamando a função que irá adicionar o item na lista.
    expenseAdd(newExpense)
}

//Método que adiciona novo item na lista
function expenseAdd(newExpense){
    try{
        //Cria elemento de li para adicionar na lista ul.
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //Criando ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        
        //Cria a info da despesa

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //Criando o nome da Despesa.
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //Criando a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name
        
        
        //Adicionando nome da despesa e categoria dentro da div(expenseInfo)
        expenseInfo.append(expenseName, expenseCategory)

        //Criando o valor da despesa

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML= `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        //Criando o ícone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")


        //Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo,expenseAmount,removeIcon)
        
        //Adicionando item na lista
        expenseList.append(expenseItem)

        //Atualiza os Totais
        updateTotals()

        //Limpando o formulário
        formClear()


        
    }
    catch(error){
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}


//Função para atualizar totais

function updateTotals(){
    try{
        //Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children
        //Atualiza a quantidade de itens da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`


        // Variável para incrementar o total
        let total = 0

        //Percorrendo cada item (li) da (ul)
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            //Removendo caracteres não numéricos e substituindo a vírgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            //converte o valor para float

            value = parseFloat(value)

            //Verificar se é um número válido

            if (isNaN(value)){
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }


            //Incrementando o valor total
            total += Number(value)

            
        }

        
        //Criando a span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        //Formatando o valor.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
        //Limpando o conteúdo do html
        expensesTotal.innerHTML = ""

       // Adicionando o símbolo da moeda e o valor
        expensesTotal.append(symbolBRL,total)

    }
    catch(error){
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }
}


//Evento que captura o clique nos itens da lista

expenseList.addEventListener("click", function(event){
    //Verificar se o item clicado é o o item de remover.
    if(event.target.classList.contains("remove-icon")){
        //obtendo a li pai do elemento clicado

        const item = event.target.closest(".expense")
        item.remove()
    }
    //Atualiza os totais
    updateTotals()
})


function formClear(){

    //Limpa os inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    //Coloca o foco no input de amount.
    expense.focus()
}