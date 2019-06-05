var numelement;
var numyears = 85;//1920-2005


function calendar_set_borndate(day, month, year) {

    var bornyearvar = document.getElementById("bornyear");
    bornyearvar.options.length = numyears + 2;
    bornyearvar.options[0].text = "Год:";
    bornyearvar.options[0].value = '';

    var borndayvar = document.getElementById("bornday");
    borndayvar.options.length = 1;
    borndayvar.options[0].text = "День:";
    borndayvar.options[0].value = '';

    for (var i = 1; i <= (numyears + 1); i++)
    {
        bornyearvar.options[i].text = 2005 - i + 1;
        bornyearvar.options[i].value = 2005 - i + 1;
    }
    if ((day) || (year))
    {

        document.getElementById("bornday").options[day].selected = 'true';
        document.getElementById("bornmonth").options[month].selected = 'true';
        document.getElementById("bornyear").options[(2005 - year + 1)].selected = 'true';

    }
}


function calendar_set_borndate_changefrommonth(index) {
    if ((index == 1) || (index == 3) || (index == 5) || (index == 7) || (index == 8) || (index == 10) || (index == 12) || (!index))
    {
        numelement = 32;
        var borndayvar = document.getElementById("bornday");
        borndayvar.options.length = numelement;

        for (var i = 1; i < numelement; i++)
        {
            borndayvar.options[i].text = i;
            borndayvar.options[i].value = i;
        }
    }
    else if ((index == 4) || (index == 6) || (index == 9) || (index == 11))
    {
        numelement = 31;
        var borndayvar = document.getElementById("bornday");
        borndayvar.options.length = numelement;

        for (var i = 1; i < numelement; i++)
        {
            borndayvar.options[i].text = i;
            borndayvar.options[i].value = i;
        }
    }
    else if (index == 2)
    {
        var yearvisokos = document.getElementById("bornyear").selectedIndex - 2;
        if ((yearvisokos % 4) == 0) {
            numelement = 30;
        }
        else {
            numelement = 29;
        }

        var borndayvar = document.getElementById("bornday");
        borndayvar.options.length = numelement;

        for (var i = 1; i < numelement; i++)
        {
            borndayvar.options[i].text = i;
            borndayvar.options[i].value = i;
        }
    }
}








function calendar_set_borndate_changefromyear() {

    if (document.getElementById("bornmonth").selectedIndex == 2)
    {
        var yearvisokos = document.getElementById("bornyear").selectedIndex - 2;
        if ((yearvisokos % 4) == 0) {
            numelement = 30;
        }
        else {
            numelement = 29;
        }
        var borndayvar = document.getElementById("bornday");
        borndayvar.options.length = numelement;

        for (var i = 1; i < numelement; i++)
        {
            borndayvar.options[i].text = i;
            borndayvar.options[i].value = i;
        }
    }
}















