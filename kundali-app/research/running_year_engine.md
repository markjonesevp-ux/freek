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
