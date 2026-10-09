# Meda Technology: Isi Website per Section

Copy final dalam bahasa Inggris (bahasa situs belum diputuskan), penjelasan dalam bahasa Indonesia. Tidak ada klien, angka, atau kebijakan yang dikarang.

**Legenda**

- `[isi]` = data atau kebijakan dari Meda
- `[cek]` = cocokkan dengan deck produk

---

## Daftar isi

1. [Ringkasan dan peta halaman](#ringkasan-dan-peta-halaman)
2. [SEO halaman utama](#seo-halaman-utama)
3. [Navbar dan footer](#navbar-dan-footer)
4. [Landing 1: Hero](#1-hero--trust-strip)
5. [Landing 2: Services](#2-services)
6. [Landing 3: Process](#3-process)
7. [Landing 4: Products](#4-products)
8. [Landing 5: Proof](#5-proof)
9. [Landing 6: About](#6-about--why-meda)
10. [Landing 7: FAQ](#7-faq)
11. [Landing 8: Contact](#8-contact)
12. [Blog](#blog)
13. [Checklist isian](#checklist-isian)

---

## Ringkasan dan peta halaman

Tiga tingkat, supaya jelas mana yang harus ada saat rilis dan mana yang bisa menyusul.

| Tingkat | Section | Alasan |
|---|---|---|
| 1. Wajib | Hero, Services, Proof, Contact | Tanpa ini situs tidak bekerja sebagai alat mencari klien |
| 2. Pembeda Meda | Process, Products | Dua hal yang membuat Meda diingat dibanding software house biasa |
| 3. Boleh menyusul | About, FAQ | Menambah kepercayaan dan menjawab keberatan, tapi tidak menghalangi rilis |

Blog hanya di navbar dan footer sampai ada 6–8 artikel.

### Peta halaman

- **Home**: 8 section di bawah
- **Layanan**: `/services/web`, `/services/mobile`, `/services/backend`, `/services/infrastructure`
- **Produk**: `/products/shiftgenius`, `/products/loyalty-plus`, `/products/meda-billing`
- **Lainnya**: `/work` (studi kasus), `/blog`, `/about`, `/contact`

> Home bercerita dan menarik minat. Halaman dalam menangkap pencarian. Semua teks harus ada sebagai HTML biasa, termasuk saat animasi 3D dimuat.

---

## SEO halaman utama

> **Title:** Meda Technology | Custom Software Development
>
> **Description:** Meda Technology builds custom web, mobile and backend software, plus ready-made products: ShiftGenius, Loyalty+ and Meda Billing.

---

## Navbar dan footer

**Navbar**

> Services · Products · About · Blog (muncul setelah ada artikel) · **Start a project** (tombol, tampil di semua halaman)

**Footer**

> *Software for what comes next.*
>
> Kolom: Services · Products · Company · Contact. Lalu kebijakan privasi dan © 2026 Meda Technology.

---

## 1. Hero + trust strip

**Tingkat 1, wajib.** Pengunjung memutuskan tinggal atau pergi dalam hitungan detik, dan Google membaca hero lebih dulu untuk tahu situs ini tentang apa. Tanpa hero yang jelas, orang bingung "ini jual apa?".

> **Eyebrow:** Software house · Est. 2016
>
> **Display:** Make it *fit.*
>
> **H1:** Custom software development that fits your business
>
> **Subcopy:** We make complicated things simple, then build the system around you, not the other way around. Web, mobile, data and infrastructure from one team.
>
> **CTA 1:** Start a project
> **CTA 2:** See our work
>
> **Trust strip:** Est. 2016 · Web, mobile, data & AI · 3 ready-made products · `[isi: N projects delivered / nama klien]`

---

## 2. Services

**Tingkat 1, wajib.** Jawaban langsung untuk "bisa pesan apa di sini?", dan halaman yang menangkap pencarian seperti "jasa pembuatan aplikasi". Tiap layanan menaut ke halaman detailnya.

> **Judul:** One team for every layer
>
> **Intro:** From the interface people use to the servers that keep it running, we design and build the whole system. No hand-offs between vendors.

| Layanan | Headline | Copy | Hasil kerja | Stack |
|---|---|---|---|---|
| Front-end | Interfaces people enjoy using | Web apps, dashboards and mobile apps that feel considered, fast and unmistakably yours. | Business web apps and internal tools · Customer portals and websites · Android and iOS apps from one Flutter codebase | Next.js, TypeScript, Flutter |
| Backend | Logic that makes products work | APIs, services, authentication and business rules that turn complexity into clarity. | REST APIs and integrations · Users, roles and permissions · Workflows, billing and notifications | Go, C#, TypeScript |
| Database | Information with direction | Data structured for decisions, with reporting that makes every number visible. | Schema design and migrations · Reports and dashboards · Import from spreadsheets or older systems `[cek]` | PostgreSQL, SQLite |
| Infrastructure | Foundations that hold the whole system | Cloud-ready environments, deployment and monitoring designed for resilience. | Dev, staging and production setup · Automated deployment · Monitoring and backups `[cek]` | Cloud, CI/CD `[isi]` |

> **Penutup:** Not sure which layer you need? Tell us the problem and we'll map the system.

Catatan: "Internet / Gateway" tetap ada di visual 3D untuk cerita, tapi di teks digabung ke Backend atau Infrastructure supaya tidak ada "layanan" yang tidak dijual.

---

## 3. Process

**Tingkat 2, pembeda.** Ketakutan terbesar klien custom software adalah proyek yang molor atau tidak jelas. Menjelaskan prosesnya jadi pembeda, karena banyak pesaing tidak melakukannya.

> **Judul:** From brief to built
>
> **Intro:** A clear, visible journey from first conversation to production. You always know what is happening and what we need from you.

| # | Tahap | Yang kami lakukan | Yang kamu terima | Peran kamu | Durasi |
|---|---|---|---|---|---|
| 1 | Requirements | We interview stakeholders, map users and workflows, and separate what must exist on day one from what can wait. | Requirements document and prioritized scope | Explain workflows, share examples, connect us to users | `[isi]` |
| 2 | Infrastructure | We set up dev and staging environments, repositories, the database and the deployment pipeline. | A working environment where progress is visible | Approve hosting and accounts | `[isi]` |
| 3 | Design & scope | We turn requirements into mockups and a PRD, then agree scope, timeline and contract. | Clickable mockups, PRD, quote and contract | Review and sign off | `[isi]` |
| 4 | Coding | We build backend, frontend and mobile in iterations. | Demo builds each iteration `[isi: frekuensi]` | Give feedback on demos | `[isi]` |
| 5 | UAT | Real users test on staging; we fix and refine. | Test checklist and resolved issue list | Test with real users, confirm acceptance | `[isi]` |
| 6 | Production | We release, migrate data and hand over. | Live system, documentation, support window `[isi]` | Approve go-live | `[isi]` |

> **Penutup:** After launch: `[isi: maintenance dan support]`

Catatan: proses yang ditampilkan harus sama dengan yang benar-benar dijalankan. Kalau tahap asli berbeda (misalnya kontrak terpisah), sesuaikan tabel ini.

---

## 4. Products

**Tingkat 2, pembeda.** Produk siap pakai membedakan Meda dari software house biasa, dan jadi bukti kemampuan yang bisa ditunjukkan penuh tanpa batasan NDA klien. Ganti mock UI dengan screenshot asli.

> **Judul:** Built once. Working everywhere.
>
> **Intro:** We turn recurring business problems into products you can start using now. `[cek: apakah bisa disesuaikan per klien?]`

### ShiftGenius (HRIS)

> **Tagline:** People, in sync.
>
> Workforce management that brings scheduling, attendance and payroll into one clear view.
>
> **Untuk:** HR teams and businesses with shift-based staff.
>
> **Fitur:** Shift scheduling · Attendance tracking · Payroll · Reports `[cek]`
>
> **Sebelum → sesudah:** Schedules in chat and spreadsheets, attendance reconciled by hand → one view for schedule, attendance and pay.
>
> **CTA:** Request a demo

### Loyalty+

> **Tagline:** Make every visit count.
>
> Loyalty management for points, rewards, campaigns and customers who keep coming back.
>
> **Untuk:** Retail, F&B and service businesses.
>
> **Fitur:** Points and tiers · Reward catalog and redemption · Campaigns · Customer history `[cek]`
>
> **Sebelum → sesudah:** Paper cards and guesswork about who returns → points, rewards and campaigns tied to real customers.
>
> **CTA:** Request a demo

### Meda Billing

> **Tagline:** Clarity for every class.
>
> School billing and operations, designed to make education administration feel lighter.
>
> **Untuk:** Schools and foundation administrators.
>
> **Fitur:** Invoices per student and class · Payment tracking · Reminders to parents · Reports `[cek]`
>
> **Sebelum → sesudah:** Manual recaps of who has paid → every invoice and payment visible in one place.
>
> **CTA:** Request a demo

---

## 5. Proof

**Tingkat 1, wajib.** Klien software membeli dari pihak yang belum pernah mereka uji. Contoh yang kita baca (Monterail, thoughtbot, Lexogrine) menaruh bukti tepat setelah hero. Bagian ini hanya bisa diisi Meda, jadi di sini hanya ada templat dan aturan.

> **Judul:** Proof, not promises

**Templat studi kasus (2–3 kartu)**

> **`[Industri]` · `[apa yang dibangun]`**
>
> **Context:** `[masalah klien, 1–2 kalimat]`
>
> **What we built:** `[3 poin: modul atau layanan]`
>
> **Result:** `[angka atau hasil konkret]`

**Elemen pendukung**

> **Baris logo:** Trusted by `[nama klien, dengan izin tertulis]`
>
> **Angka (pilih 2–3):** Est. 2016 · `[N]` projects delivered · `[N]` active users across our products
>
> **Testimoni:** "`[kutipan spesifik tentang hasil]`", `[Nama, jabatan, perusahaan]`

**Aturan**

- Belum ada angka besar? Gunakan hasil yang jujur dan kecil, misalnya "menggantikan N spreadsheet dengan satu sistem" atau "N pengguna aktif".
- Belum ada klien publik? Pakai proyek anonim ("sistem rekrutmen untuk perusahaan jasa, 3 modul") atau jenis klien: schools, retail, service companies.
- Logo klien hanya dengan izin tertulis. Cek juga kontrak atau NDA.

---

## 6. About / Why Meda

**Tingkat 3, boleh menyusul.** Klien sering mengecek siapa di balik sebuah software house. Section ini menambah kepercayaan, dan tidak fatal kalau menyusul asal kontak dan alamat jelas.

> **Judul:** Why Meda
>
> Meda Technology is a software house founded in 2016 `[isi: kota]`. We believe your system should feel like clothes or shoes that fit perfectly, not something your team has to force itself into.
>
> **One team, every layer.** Frontend, backend, data and infrastructure under one roof, so nothing gets lost between vendors.
>
> **Visible progress.** You see working builds throughout, not a surprise at the end.
>
> **Products of our own.** ShiftGenius, Loyalty+ and Meda Billing show how we build.
>
> **Plain language.** We explain trade-offs without jargon.
>
> **Tim:** `[isi: peran utama + foto asli]`
> **Lokasi:** `[isi]`

---

## 7. FAQ

**Tingkat 3, boleh menyusul.** Menjawab keberatan sebelum klien bertanya, dan teksnya membantu pencarian panjang. Markup FAQ boleh dipasang, tapi Google kini membatasi tampilan khusus FAQ di hasil pencarian untuk situs tertentu, jadi jangan berharap tampilan itu.

| Pertanyaan | Jawaban draft |
|---|---|
| What does a project include? | Requirements, infrastructure, design and scope, coding, user acceptance testing and production. You see each stage, from first conversation to launch. |
| How much does custom software cost? | It depends on scope: users and roles, features, integrations, platforms and data migration. After requirements we agree scope and a quote. `[isi: model harga atau kisaran]` |
| How long does it take? | Small tools take weeks, larger platforms take months `[isi: kisaran nyata]`. The timeline is agreed at design and scope. |
| Who owns the source code? | `[isi sesuai kontrak]` |
| How does payment work? | `[isi: mis. per milestone]` |
| Do you support us after launch? | `[isi]` |
| Can you connect to our existing systems? | Yes, through APIs or data import where the existing system allows it. We check this during requirements. |
| Which technologies do you use? | Go, JavaScript and TypeScript, Next.js, PostgreSQL, SQLite, C# and Flutter. We choose by fit, not fashion. |
| Custom software or a ready-made product? | If one of our products already covers your need, we'll say so. If not, we build it custom. |

---

## 8. Contact

**Tingkat 1, wajib.** Titik konversi. Semua section lain hanya mengantar ke sini, jadi form harus pendek: tiap field tambahan mengurangi jumlah pengirim.

> **Judul:** What needs to work better?
>
> **Subcopy:** Tell us about the system you want to build, improve or bring to life.

**Form**

- **Field:** Name · Email · WhatsApp (opsional) · Company
- **Dropdown "What do you need?":** New custom system / Improve an existing system / ShiftGenius / Loyalty+ / Meda Billing / Not sure yet
- **Message (placeholder):** "Describe the problem: what is slow, manual or broken today?"
- **Budget (opsional):** `[isi: kisaran]`
- **Tombol:** Send message
- **Microcopy:** We reply within `[isi: hanya kalau bisa ditepati]`.
- **Kontak langsung:** `[email]` · `[WhatsApp]` · `[kota]`

**Pesan setelah kirim**

> Thanks, we got it. Next: 1) we read your message, 2) we reply within `[isi]` with questions or a time for a short call, 3) after the call you get a clear recommendation. No obligation.

---

## Blog

Blog menangkap pencarian jangka panjang dan menunjukkan keahlian, tapi bukan penentu konversi hari pertama. Tampil di navbar dan footer setelah ada 6–8 artikel. Di landing, preview 3 artikel terbaru baru ditambahkan setelah rutin terbit, di atas FAQ.

### Halaman daftar (`/blog`)

> **Title:** Blog | Meda Technology
>
> **Description:** Practical guides on custom software, HR, loyalty and school billing systems, from the team at Meda Technology.
>
> **H1:** Notes from the build
>
> **Subcopy:** Practical guides for teams planning, buying or improving their software. No jargon.
>
> **Kategori:** Planning custom software · HR & workforce · Loyalty & retail · School administration · Behind the build
>
> **Kartu artikel:** Judul, ringkasan 1–2 baris, kategori, tanggal, waktu baca.

### Kerangka tiap artikel

- **Judul (H1)** memuat keyword utama, dengan tanggal dan nama penulis asli.
- **Jawaban singkat di paragraf pertama:** 2–3 kalimat yang langsung menjawab, baru penjelasan.
- **Heading rapi (H2/H3),** satu gagasan per bagian.
- **Isi yang benar-benar membantu:** contoh, daftar periksa, atau perbandingan dari pengalaman sendiri.
- **Kotak CTA** di tengah dan di akhir, menuju layanan atau produk yang relevan.
- **2–3 artikel terkait** di bagian bawah.
- Panjang 800–1500 kata, selama setiap bagian berguna.

**Contoh CTA di akhir artikel**

> Planning a system like this? Tell us the problem and we'll tell you honestly whether custom or ready-made fits. **Start a project →**

Ritme realistis: 2 artikel bagus per bulan. Draf AI boleh, tapi wajib diedit manusia dan diberi pengalaman atau data asli Meda. Kelola lewat CMS agar bisa diisi tanpa developer, dengan URL bersih, masuk sitemap, dan title serta meta description per artikel. Jangan publikasikan blog kosong.

---

## Checklist isian

Yang hanya bisa diisi Meda, urut dari yang paling menentukan.

- [ ] **Proof:** 2–3 proyek atau klien yang boleh ditampilkan, beserta izin logo, dan 2–3 angka yang benar
- [ ] **Kebijakan FAQ:** kisaran harga, durasi, kepemilikan kode, pembayaran, support setelah live
- [ ] **Produk:** fitur asli dan screenshot ShiftGenius, Loyalty+, Meda Billing (hapus semua tanda `[cek]`)
- [ ] **Process:** durasi tiap tahap, frekuensi demo, dan masa dukungan setelah rilis
- [ ] **Kontak:** email, WhatsApp, kota, dan janji waktu respons yang bisa ditepati
- [ ] **About:** peran utama tim dan foto asli
- [ ] **Keputusan bahasa situs:** Indonesia, Inggris, atau keduanya
- [ ] **Blog:** 6–8 artikel siap sebelum link Blog muncul di navbar
