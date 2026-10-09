# Chalu varsh engine (v28.2) — kya karta hai aur kitna sahi nikla

## Engine
Sawhney ka shasak bhaav: chalu varsh = poori umr + 1; (varsh − 1) mod 12 + 1 = lagna se shasak bhaav.
Phir lagna kundali se in sab ka hisaab:

1. **Shasak bhaav** — uske vishay; 6/8/12 ho to tone neeche.
2. **Uska swami** — kis bhaav mein, kis rashi mein, uchch/neech/swarashi, vakri ya ast.
3. **Swami ke doosre bhaav** — swami aur kin bhaavon ka swami hai.
4. **Swami ki drishti** — swami kin bhaavon ko dekhta hai, aur wahan kaun baitha hai.
5. **Swami ke saath kaun hai** — saath baithe grah aur swami ko dekhne wale grah, aur ve kin bhaavon ke swami hain. Har grah ki tone kaarak/akaarak aur naisargik shubh/paap hone se tay hoti hai.
6. **Shasak bhaav mein / us par kaun** — wahan baithe ya use dekhne wale grah.
7. **Dasha** — varsh ke andar ki mahadasha aur antardasha, agar ve swami se judi hon.
8. **Gochar** — Shani, Guru aur Rahu ka gochar; shasak bhaav ya swami par Shani/Guru; lagna par Shani; saadhesaati.

Har jeevan-kshetra (sehat, dhan, kaam, jeevansathi, santaan, ghar, bhai-bahan, bhagya, videsh, laabh, vivaad, achanak ghatnayein) ka **sakriyata** aur **tone** in kaarakon se nikalta hai. Sakriyata kshetra ke ghar-sankhya se barabar ki jaati hai.

**Sehat ka hissa:**
- Kaal-purush se sharir ke ang: shasak bhaav, uski rashi, aur swami ka bhaav va rashi.
- Jude grahon ke rog aur dosha (kaph, pitt, vaat).

## Sach kitna?
`sy_test.js` — 40 janm-samay wale log, 240 ghatnayein. Jaancha gaya ki ghatna ka kshetra us varsh ke upar ke 4 kshetron mein tha ya nahi (tone mel ke saath). Sanyog = usi vyakti ke baaki 11 varshon mein engine ka wahi jawab.

| Jaanch | Sahi | Sanyog se | z |
|---|---|---|---|
| Upar ke 4 + tone (app jaisa) | 54/240 | 60.4 (25%) | −1.0 |
| Nidhan ko rishte ke bhaav se | 53/240 | 59.1 | −1.0 |
| Sirf upar ke 4 (tone nahi) | 76/240 | 79.5 (33%) | −0.5 |
| Sabse upar wala kshetra | 16/240 | 21.4 (9%) | −1.2 |

**Nateeja:** shasak-bhaav paddhati, lagna-vishleshan ke saath bhi, sanyog se behtar nahi nikli. Isliye page par yeh saaf likha hai.

Har baat ke saath yeh bhi likha hai ki vah 12 mein se kitne varshon mein aati hai. Saath mein ek **andhi jaanch** hai: 4 is varsh ki baatein aur 4 kisi doosre varsh ki baatein mila di jaati hain, aur upyogkarta tick karta hai ki kya hua.

**Rohit ki kundali (varsh 32, 8th bhaav):** upar ke kshetra yeh aaye:
- achanak ghatnayein — 12 mein se 1 varsh mein aata hai, yaani is varsh ke liye khaas
- sehat — 7/12 varsh, yaani aam baat
- dhan — 5/12 varsh
- bhai-bahan/vivaad

**Sehat ka bhed:** nasein/man, sir, chehra/gala; pitt pradhan.

Engine ko unke bataaye anubhav ke hisaab se badla nahi gaya.

## v28.3: har kone se, aur kaun-sa kona madad karta hai
`sy_exp.js`, `sy_exp2.js` — har kona alag chalu karke parkha. Upyogkarta ko do aadhe hisson mein baanta gaya (ek-chhodkar ek). Koi sudhaar tab maana jaata jab dono hisson mein tike.

| Kona | Sahi | Sanyog se | Aadha A | Aadha B |
|---|---|---|---|---|
| Sirf shasak bhaav + swami | 54/240 | 60.4 | +0.45 | −1.86 |
| + shubh/paap swabhav | 60 | 62.5 | +0.97 | −1.54 |
| + karakatva | 57 | 64.6 | −0.18 | −1.46 |
| + navamsha | 51 | 60.8 | +0.06 | −2.20 |
| + nakshatra-swami | 49 | 58.9 | −0.12 | −2.08 |
| + Chandra lagna se | 63 | 62.7 | +1.03 | −0.93 |
| + varsh-lagna | 52 | 64.4 | −0.18 | −2.52 |
| + antardasha | 48 | 59.4 | −0.04 | −2.49 |
| Sab kone saath | 68 | 69.5 | +1.47 | −1.77 |
| Sab + umr ka padav (±6 varsh ki khidki) | 74 | 76.8 | +0.49 | −1.10 |

**Nateeja:** koi bhi kona dono hisson mein sanyog se upar nahi gaya.

**App mein:** "sab kone" chalu hain. Yeh kisi se bura nahi hai, aur Shukra jaise shubh grah ka swabhav aur karakatva (dhan, sukh, vilasita) ab hisaab mein aata hai. Page par saaf likha hai ki yeh pakki bhavishyavani nahi hai.

**Rohit ke varsh 32 mein naye kone kya dikhate hain:**
- Shukra Vishakha nakshatra mein hai, jiska swami Guru (3, 6) hai.
- Navamsha mein Shukra 6th bhaav mein hai, Rahu ke saath.
- Shukra–Rahu ki yuti 0.3° ki hai.
- Malavya yoga ban raha hai.
- Varsh-lagna Kanya hai, jo janm-kundali ka 12th bhaav hai; varshesh Shukra hai.

## Bhaav ka rang karakatva par (Rohit ke feedback ke baad)
Rohit ne varsh 32 ke baare mein bataya:
- paise ki bachat nahi hui, aur sukh-vilasita se door rahe
- share market mein nuksaan hua
- naukri achhi chali
- man ki shanti nahi rahi
- nayi business partnership hui
- sehat mein dikkatein rahi

Isse do classical siddhant joDe gaye. Ye flag `col` ke peeche hain.
1. 6/8/12 shasak bhaav ki peeda ye cheezein le leti hain:
   - uske swami ke karakatva (Shukra: dhan, sukh, jeevansathi)
   - us bhaav mein baithe grah ka karakatva (Chandra: man)
   - swami ke saath baithe grahon ka karakatva
   Achhe bhaav ka rang inhi par shubh padta hai. Bhaav mein baitha grah agar uchch/swarashi ho, to apne bhaavon ko sambhaale rakhta hai (Chandra uchch → 10th).
2. Rahu agar swami ke 5° ke andar ho → satta/share/bhram se haani ka yog.

Saath hi: swami jis bhaav ko dekhta hai, wahan ghatna ya nayi shuruaat sambhav (Shukra → 7th: saajhedaari).

**40 logon par jaanch:**
- Sab kone + rang: 65/240, jabki sanyog se 68.5 aate (aadha A z +1.48, aadha B −2.13).
- Bina rang: 68 vs 69.5.

Yaani yeh niyam bhi sanyog jaise hi rahe. Rohit ka apna varsh is jaanch ka saboot nahi ho sakta, kyunki niyam usi se prerit hain. Unki asli jaanch aage ke varsh aur diary hain.

## v28.4: KP ke saath taalmel, aur Rahu/Ketu unke swamiyon ke zariye

**KP ka varsh-score:**
- Har ghatna-prakaar ke liye saal ke 12 mahinon ka ausat KP ank liya gaya.
- Phir use aas-paas ke 11 saalon (5 pehle, 6 baad) se milaya gaya.
- Agar KP is saal ko upar ke 25% mein rakhe, aur chalu-varsh engine bhi us kshetra ko upar ke 4 mein (sahi rukh ke saath) rakhe, to us ghatna ko "dono sahmat" maankar highlight kiya jaata hai.
- Saath mein KP ke sabse majboot 2 mahine bhi dikhte hain.

**Rahu/Ketu:**
- Rahu/Ketu ko unki rashi ke swami aur nakshatra-swami ke zariye padha gaya. Saath mein yeh bhi dekha gaya ki woh swami maarak hai ya nahi, janm mein neech hai ya nahi, aur Rahu/Ketu ka shatru hai ya nahi.
- Rahu/Ketu jis bhaav mein baithe hain, aur jis graha ki rashi ya nakshatra mein hain, us graha ka karakatva bhi joda gaya.
- Janm ke Rahu/Ketu tabhi gine jaate hain jab woh saal se jude hon. Gochar ke Rahu/Ketu ki rashi aur nakshatra mahine-wise dikhte hain.

**Jaanch (`syk_test2.js`, Rohit ko chhodkar 40 log, 183 ghatnayein; sanyog = aas-paas ke saal):**

| Paimaana | Sahi | Sanyog se | z | Aadha A | Aadha B |
|---|---|---|---|---|---|
| Engine + KP dono sahmat | 13/183 | 12.6 | +0.11 | +0.44 | −0.27 |
| Sirf KP (saal upar ke 25% mein) | 55/183 | 47.0 | +1.40 | +0.37 | +1.56 |
| Sirf engine | 49/183 | 47.6 | +0.25 | — | — |

Rohit ko shaamil karne par KP 62/196 aur sanyog 49.8 tha (z +2.06). Par KP pehle Rohit ki kundali par tune hua tha, isliye unhe hata kar dekha gaya.

**Rahu/Ketu wala kona (`sy_exp.js`):**
- Rahu/Ketu ke saath: 62/243, sanyog 65.6.
- Rahu/Ketu ke bina: 66/243, sanyog 69.8.
- Yaani dono sanyog jaise hain.

**Nateeja:** "dono sahmat" sanyog se behtar nahi hai. KP ka varsh-score ek halka ishara deta hai (dono aadhe hisson mein disha upar ki taraf hai), par saboot nahi hai. Isliye ise nigrani suchi mein rakha gaya hai. App mein highlight ke saath yahi baat likhi hai.

**Rohit ke saal (ye ghatnayein engine banne ke baad bataayi gayi thi):**
- **Varsh 31:** dono "sampatti" par sahmat the (82%; KP ke mahine Apr–May 2025). Kabza Jan 2025 mein hua, yaani saal sahi tha par mahine nahi.
- **Varsh 32:** dono dhan-haani (100%) aur sehat (82%) par sahmat the.
- **Varsh 30:** dono kisi baat par sahmat nahi the. Akele KP ne sampatti ko 100% diya (booking Nov 2023 mein hui).
