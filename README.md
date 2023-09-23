#	 *Warehelper* sistemos aprašymas
## Sistemos paskirtis

Kuriama sistema yra internetinė programa, skirta supaprastinti įmonių inventoriaus sekimą ir valdymą, kurios turi vieną ar daugiau sandėlių. 
Įmonės puslapį sistemoje valdo administratorius, kuris prižiūri visus įmonės turimus sandėlius, gali juos modifikuoti esant poreikiui. Jie turi teisę priskirti darbuotojus konkrečioms saugojimo vietoms. Darbuotojai atsakingi už kasdienį daiktų valdymą savo priskirtose saugojimo vietose. Šie naudotojai gali manipuliuoti duomenimis, susijusiais su jų priskirtais sandėliais, įskaitant daiktų pridėjimą, atnaujinimą ir pašalinimą, kai tai reikalinga. Jie gali bet kada gauti išsamią informaciją apie kiekvieną daiktą.

##	Funkciniai reikalavimai

Iš viso skiriami 2 pagrindiniai vartotojų tipai: įmonės sistemos administratorius, bei paprastas darbuotojas. Neregistruoti vartotojai (svečiai) mato tik pagrindinį sistemos puslapį ir gali tik prisiregistruoti arba prisijungti.

![image](https://github.com/zaiolul/warehelper_app/assets/89912978/cbb5c457-5b75-4467-b17a-be018d905a53)


**Sistemos administratoriui galima:**
- Pridėti sandėlius;
- Šalinti sandėlius;
- Peržiūrėti visus sandėlius;
- Keisti sandėlio informaciją;
- Priskirti registruotus vartotojus prie įmonės kaip darbuotojus;
- Priskirti darbuotojus prie sandėlių;
- Peržiūrėti visus įmonės darbuotojus, pridėtus prie sandėlių;
- Atsieti darbuotojus nuo sandėlio;

**Darbuotojui galima:**
- Peržiūrėti visus jam priskirtus sandėlius;
- Pridėti naują daiktą į sandėlį;
- Šalinti daiktą iš sandėlio;
- Modifikuoti sandelyje esančio daikto informaciją;
- Peržiūrėti panašių daiktų informaciją kituose sandėliuose;

## Sistemos architektūra

Sistemą sudaro kliento ir serverio dalys. Kliento pusėje funkcionalumą įgyvendinti bus naudojama React.js. Serverio pusė bus realizuota naudojant ASP.NET Core. Projektui naudojama MySQL duomenų bazės valdymo sistema. Projektas bus talpinamas Microsoft Azure serveryje. 

 
![Deployment diagram](https://github.com/zaiolul/warehelper_app/assets/89912978/7d063c4f-ef89-4dff-9ac7-44f690fa47e8)
