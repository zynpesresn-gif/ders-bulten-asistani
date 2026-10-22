
(function () {
    'use strict';

    function ekleBultenButonlari() {
        const alan = document.getElementById('bulletinTextPreview');
        if (!alan || document.getElementById('ekOzellikButonlari')) return;

        const grup = document.createElement('div');
        grup.id = 'ekOzellikButonlari';
        grup.className = 'flex flex-wrap gap-2 mt-3';

        const pdf = document.createElement('button');
        pdf.type = 'button';
        pdf.textContent = '📄 PDF olarak kaydet';
        pdf.className =
            'px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm';
       


pdf.onclick = function () {
    const metin = alan.value.trim();

    if (!metin) {
        alert('Önce bülten metnini oluşturun.');
        return;
    }

    const pencere = window.open('', '_blank');

    if (!pencere) {
        alert('Yeni pencere açılamadı. Tarayıcı izinlerini kontrol edin.');
        return;
    }

    function guvenliMetin(deger) {
        return deger.replace(/[&<>"']/g, function (karakter) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[karakter];
        });
    }

    const satirlar = metin.split(/\r?\n/);
    const bolumler = [];
    let aktifBolum = {
        baslik: '',
        metin: []
    };

    // "Kazanımlar" listeden çıkarıldı
    const basliklar = {
        'ders özeti': 'Ders Özeti',
        'dersin özeti': 'Ders Özeti',
        'çalışma önerileri': 'Çalışma Önerileri',
        'calisma onerileri': 'Çalışma Önerileri',
        'ödevler': 'Ödevler',
        'ödev bilgileri': 'Ödev Bilgileri',
        'odevler': 'Ödevler'
    };

    satirlar.forEach(function (satir) {
        const temiz = satir.trim();
        const anahtar = temiz
            .replace(/^#+\s*/, '')
            .replace(/[:：]\s*$/, '')
            .toLocaleLowerCase('tr-TR');

        if (basliklar[anahtar]) {
            if (aktifBolum.metin.some(function (s) {
                return s.trim();
            }) || aktifBolum.baslik) {
                bolumler.push(aktifBolum);
            }

            aktifBolum = {
                baslik: basliklar[anahtar],
                metin: []
            };
        } else {
            // "kazanımlar" içeren satırları atlamak için kontrol
            if (anahtar !== 'kazanımlar' && anahtar !== 'kazanimlar') {
                aktifBolum.metin.push(satir);
            }
        }
    });

    if (aktifBolum.metin.some(function (s) {
        return s.trim();
    }) || aktifBolum.baslik) {
        bolumler.push(aktifBolum);
    }

    const icerikHTML = bolumler.map(function (bolum) {
        const baslikHTML = bolum.baslik ? `<h2>${guvenliMetin(bolum.baslik)}</h2>` : '';
        return `
            <section class="icerik-bolumu">
                <div class="bolum-govde">
                    ${baslikHTML}
                    <div class="bolum-metni">${guvenliMetin(
                        bolum.metin.join('\n').trim()
                    )}</div>
                </div>
            </section>
        `;
    }).join('');

    pencere.document.open();
    pencere.document.write(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dersimizden Notlar | Zeynep Esra Arikan</title>
<style>
@page {
    size: A4;
    margin: 16mm 17mm 18mm;
}

:root {
    --krem-zemin: #FAF6F0;
    --acik-krem: #FFFDF9;
    --lila-ana: #8A76A6;
    --lila-koyu: #5E4B75;
    --pudra: #E6B8C2;
    --pudra-yumusak: #F2D6D8;
    --metin-kahve: #4A3E3D;
    --ince-cizgi: #E8D8DC;
}

* {
    box-sizing: border-box;
}

html {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

body {
    margin: 0;
    background: var(--krem-zemin);
    color: var(--metin-kahve);
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.75;
}

.sayfa-cercevesi {
    position: relative;
    min-height: 255mm;
    padding: 14mm 16mm;
    background:
        radial-gradient(
            circle at 5% 5%,
            rgba(230, 184, 194, 0.25),
            transparent 38%
        ),
        radial-gradient(
            circle at 95% 95%,
            rgba(138, 118, 166, 0.18),
            transparent 42%
        ),
        radial-gradient(
            circle at 50% 50%,
            rgba(242, 214, 216, 0.12),
            transparent 60%
        ),
        var(--acik-krem);
    border: 1px solid var(--ince-cizgi);
    border-radius: 4px;
}

.ust-bolum {
    display: flex;
    align-items: center;
    gap: 18px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--ince-cizgi);
}

/* İç İçe Geçen ZEA Monogram Yapısı */
.monogram-kapsayici {
    width: 64px;
    height: 64px;
    flex: 0 0 64px;
    position: relative;
    border: 1.5px solid var(--pudra);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(242, 214, 216, 0.4), rgba(138, 118, 166, 0.18));
    box-shadow: inset 0 0 10px rgba(230, 184, 194, 0.25);
    overflow: hidden;
}

.monogram-ic {
    font-family: 'Georgia', serif;
    font-weight: bold;
    font-size: 16pt;
    line-height: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.harf-z {
    color: var(--lila-koyu);
    transform: translateX(4px);
    z-index: 1;
}

.harf-e {
    color: var(--pudra);
    font-size: 14pt;
    margin: 0 -3px;
    z-index: 2;
    opacity: 0.95;
    mix-blend-mode: multiply;
}

.harf-a {
    color: var(--lila-ana);
    transform: translateX(-4px);
    z-index: 3;
}

.kimlik {
    min-width: 0;
}

.isim {
    margin: 0 0 4px;
    color: var(--lila-ana);
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 2.5px;
}

.baslik {
    margin: 0;
    font-family: Georgia, serif;
    font-size: 24pt;
    line-height: 1.2;
    font-weight: normal;
    color: var(--lila-koyu);
}

.alt-baslik {
    margin: 6px 0 0;
    color: #8C7882;
    font-size: 9pt;
    font-style: italic;
}

.dekor-cizgi {
    width: 48px;
    height: 3px;
    margin: 20px 0 24px;
    border-radius: 3px;
    background: linear-gradient(to right, var(--pudra), var(--lila-ana));
}

.icerik-bolumu {
    margin: 0 0 22px;
    break-inside: avoid;
    page-break-inside: avoid;
}

.bolum-govde {
    width: 100%;
}

.bolum-govde h2 {
    margin: 0 0 10px;
    color: var(--lila-ana);
    font-family: Georgia, serif;
    font-size: 14.5pt;
    line-height: 1.35;
    font-weight: normal;
    border-bottom: 1px dashed var(--pudra-yumusak);
    padding-bottom: 4px;
}

.bolum-metni {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: var(--metin-kahve);
    font-size: 10.5pt;
    line-height: 1.8;
}

.alt-imza {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--ince-cizgi);
    text-align: right;
    break-inside: avoid;
}

.imza-notu {
    color: #8C7882;
    font-size: 8.5pt;
}

.imza-isim {
    margin-top: 2px;
    color: var(--lila-koyu);
    font-family: Georgia, serif;
    font-size: 13.5pt;
}

.alt-marka {
    margin-top: 12px;
    color: var(--lila-ana);
    font-size: 7.5pt;
    letter-spacing: 1.8px;
    opacity: 0.85;
}

@media screen {
    body {
        padding: 24px;
    }

    .sayfa-cercevesi {
        max-width: 800px;
        margin: 0 auto;
        box-shadow: 0 10px 32px rgba(94, 75, 117, 0.08);
    }
}

@media print {
    body {
        background: white;
    }

    .sayfa-cercevesi {
        min-height: 0;
        padding: 0;
        border: none;
        background-color: var(--acik-krem);
    }

    .ust-bolum,
    .icerik-bolumu,
    .alt-imza {
        break-inside: avoid;
        page-break-inside: avoid;
    }
}
</style>
</head>
<body>
<main class="sayfa-cercevesi">
    <header class="ust-bolum">
        <div class="monogram-kapsayici" aria-label="ZEA Monogramı">
            <div class="monogram-ic">
                <span class="harf-z">Z</span>
                <span class="harf-e">E</span>
                <span class="harf-a">A</span>
            </div>
        </div>
        <div class="kimlik">

            <h1 class="baslik">Dersimizden Notlar</h1>
            <p class="alt-baslik">
                Her ders yeni bir adım, her adım yeni bir keşif
            </p>
        </div>
    </header>

    <div class="dekor-cizgi"></div>

    <div class="icerik">
        ${icerikHTML}
    </div>

    <footer class="alt-imza">
        <div class="imza-notu">Matematik Öğretmeni</div>
        <div class="imza-isim">Zeynep Esra Arikan</div>
    
    </footer>
</main>
</body>
</html>`);

    pencere.document.close();

    pencere.onload = function () {
        pencere.focus();
        pencere.print();
    };
};


        
        
        const gorsel = document.createElement('button');
        gorsel.type = 'button';
        gorsel.textContent = '🎨 Görsel olarak kaydet';
        gorsel.className =
            'px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm';

        gorsel.onclick = function () {
            const metin = alan.value.trim();
            if (!metin) {
                alert('Önce bülten metnini oluşturun.');
                return;
            }

            const satirlar = metin.split('\n');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const genislik = 900;
            const satirYuksekligi = 34;
            const kenar = 55;
            const satirlarSayisi = Math.max(satirlar.length, 1);

            canvas.width = genislik;
            canvas.height = Math.max(
                360,
                180 + satirlarSayisi * satirYuksekligi
            );

            ctx.fillStyle = '#f8f4fb';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(25, 25, genislik - 50, canvas.height - 50);

            ctx.fillStyle = '#7356a5';
            ctx.fillRect(25, 25, genislik - 50, 85);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 27px Arial';
            ctx.fillText('ÖZEL DERS • VELİ BÜLTENİ', kenar, 77);

            ctx.fillStyle = '#29344a';
            ctx.font = '21px Arial';

            let y = 155;
            satirlar.forEach(function (satir) {
                const parcalar = satir.match(/.{1,62}/gu) || [''];
                parcalar.forEach(function (parca) {
                    ctx.fillText(parca, kenar, y);
                    y += satirYuksekligi;
                });
            });

            ctx.fillStyle = '#7356a5';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('Zeynep Esra Hoca', kenar, canvas.height - 45);

            const link = document.createElement('a');
            link.download = 'veli-bulteni.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        grup.append(pdf, gorsel);
        alan.insertAdjacentElement('afterend', grup);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ekleBultenButonlari);
    } else {
        ekleBultenButonlari();
    }

    window.addEventListener('load', ekleBultenButonlari);
})();

/* Öğrenciye özel PDF arşivi */
(function () {
    'use strict';

    function openArchiveDB() {
        return new Promise(function (resolve, reject) {
            const request = indexedDB.open('DersBultenPDFArsivi', 1);

            request.onupgradeneeded = function () {
                const db = request.result;
                if (!db.objectStoreNames.contains('pdfler')) {
                    const store = db.createObjectStore('pdfler', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('studentId', 'studentId', {
                        unique: false
                    });
                }
            };

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error);
            };
        });
    }

    async function archiveRequest(mode, action) {
        const db = await openArchiveDB();

        return new Promise(function (resolve, reject) {
            const transaction = db.transaction('pdfler', mode);
            const request = action(transaction.objectStore('pdfler'));

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error);
            };
        });
    }

    async function showStudentPDFs(student, list) {
        list.replaceChildren();

        try {
            const files = await archiveRequest('readonly', function (store) {
                return store.index('studentId').getAll(String(student.id));
            });

            if (!files.length) {
                const message = document.createElement('p');
                message.textContent = 'Bu öğrenciye henüz PDF eklenmedi.';
                message.className = 'text-xs text-slate-500';
                list.appendChild(message);
                return;
            }

            files.forEach(function (file) {
                const row = document.createElement('div');
                row.className =
                    'flex flex-wrap items-center gap-2 border-t py-2';

                const name = document.createElement('span');
                name.textContent = file.name;
                name.className = 'text-xs flex-1 break-all';

                const open = document.createElement('button');
                open.type = 'button';
                open.textContent = 'Aç';
                open.className =
                    'px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs';

                open.onclick = function () {
                    const url = URL.createObjectURL(file.data);
                    const tab = window.open(url, '_blank');

                    if (!tab) {
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = file.name;
                        link.click();
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(url);
                    }, 60000);
                };

                const remove = document.createElement('button');
                remove.type = 'button';
                remove.textContent = 'Sil';
                remove.className =
                    'px-3 py-2 rounded-lg bg-rose-50 text-rose-700 text-xs';

                remove.onclick = async function () {
                    if (!confirm('Bu PDF dosyasını silmek istiyor musunuz?')) {
                        return;
                    }

                    try {
                        await archiveRequest('readwrite', function (store) {
                            return store.delete(file.id);
                        });
                        await showStudentPDFs(student, list);
                    } catch (error) {
                        alert('PDF silinemedi.');
                    }
                };

                row.append(name, open, remove);
                list.appendChild(row);
            });
        } catch (error) {
            list.textContent = 'PDF arşivi açılamadı.';
        }
    }

    function addArchiveToStudentCards() {
        const grid = document.getElementById('studentGrid');
        if (!grid || typeof students === 'undefined') return;

        Array.from(grid.children).forEach(function (card, index) {
            const student = students[index];
            if (!student || card.querySelector('.student-pdf-archive')) {
                return;
            }

            const section = document.createElement('section');
            section.className =
                'student-pdf-archive mt-4 pt-3 border-t space-y-3';

            const title = document.createElement('h5');
            title.textContent = '📁 Öğrenci PDF Arşivi';
            title.className = 'font-semibold text-sm';

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,application/pdf';
            input.className = 'block w-full text-xs';

            const status = document.createElement('p');
            status.className = 'text-xs text-slate-500';

            const list = document.createElement('div');
            list.className = 'space-y-2';

            input.addEventListener('change', async function () {
                const file = input.files && input.files[0];
                if (!file) return;

                if (!file.name.toLowerCase().endsWith('.pdf')) {
                    alert('Lütfen bir PDF dosyası seçin.');
                    input.value = '';
                    return;
                }

                if (file.size > 15 * 1024 * 1024) {
                    alert('Dosya en fazla 15 MB olabilir.');
                    input.value = '';
                    return;
                }

                try {
                    await archiveRequest('readwrite', function (store) {
                        return store.add({
                            studentId: String(student.id),
                            name: file.name,
                            data: file,
                            addedAt: new Date().toISOString()
                        });
                    });

                    status.textContent = 'PDF arşive eklendi.';
                    await showStudentPDFs(student, list);
                } catch (error) {
                    status.textContent =
                        'PDF kaydedilemedi. Tarayıcı depolama alanını kontrol edin.';
                }

                input.value = '';
            });

            section.append(title, input, status, list);
            card.appendChild(section);
            showStudentPDFs(student, list);
        });
    }

    function connectStudentArchive() {
        if (typeof window.renderStudentsGrid === 'function' &&
            !window.renderStudentsGrid._archiveConnected) {
            const originalRender = window.renderStudentsGrid;

            const wrappedRender = function () {
                originalRender();
                addArchiveToStudentCards();
            };

            wrappedRender._archiveConnected = true;
            window.renderStudentsGrid = wrappedRender;
        }

        addArchiveToStudentCards();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', connectStudentArchive);
    } else {
        connectStudentArchive();
    }
})();

/* Pastel bülten tasarımı, görsel paylaşımı ve hatırlatma düzeltmesi */
(function () {
    'use strict';

    function getBulletinText() {
        const area = document.getElementById('bulletinTextPreview');
        return area ? area.value.trim() : '';
    }



function createPastelImage() {
    return new Promise(function (resolve, reject) {
        const text = getBulletinText();

        if (!text) {
            alert('Önce bülteni oluşturun.');
            reject(new Error('Bülten boş.'));
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width = 1000;
        const margin = 76;
        const contentWidth = width - margin * 2;
        const lineHeight = 43;
        const cleanText = text.replace(/\*/g, '');
        const paragraphs = cleanText.split('\n');
        const lines = [];

        ctx.font = '27px Arial';

        paragraphs.forEach(function (paragraph) {
            if (!paragraph.trim()) {
                lines.push('');
                return;
            }

            let line = '';

            paragraph.split(/\s+/).forEach(function (word) {
                const test = line ? line + ' ' + word : word;

                if (ctx.measureText(test).width > contentWidth && line) {
                    lines.push(line);
                    line = word;
                } else {
                    line = test;
                }
            });

            if (line) lines.push(line);
        });

        const headerHeight = 240;
        const footerHeight = 150;
        const contentHeight = Math.max(300, lines.length * lineHeight + 70);

        canvas.width = width;
        canvas.height = headerHeight + contentHeight + footerHeight;

        const gradient = ctx.createLinearGradient(0, 0, width, canvas.height);
        gradient.addColorStop(0, '#FAF6F0');
        gradient.addColorStop(0.5, '#FFFDF9');
        gradient.addColorStop(1, '#F2D6D8');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, canvas.height);

        // Yumuşak pastel, ebruli hissi veren renk geçişleri
        function softCircle(x, y, radius, color) {
            const g = ctx.createRadialGradient(x, y, 5, x, y, radius);
            g.addColorStop(0, color);
            g.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        softCircle(80, 90, 190, 'rgba(230,184,194,0.48)');
        softCircle(900, 140, 210, 'rgba(138,118,166,0.30)');
        softCircle(120, canvas.height - 100, 220, 'rgba(242,214,216,0.55)');
        softCircle(920, canvas.height - 180, 220, 'rgba(230,184,194,0.35)');

        // İnce, zarif çerçeve
        ctx.strokeStyle = '#E8D8DC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(28, 28, width - 56, canvas.height - 56, 24);
        ctx.stroke();

        // ZEA monogramı
        ctx.beginPath();
        ctx.arc(112, 112, 48, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(242,214,216,0.45)';
        ctx.fill();
        ctx.strokeStyle = '#E6B8C2';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 29px Georgia';
        ctx.fillStyle = '#5E4B75';
        ctx.fillText('ZEA', 112, 112);

        // Başlık
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        ctx.font = '48px Georgia';
        ctx.fillStyle = '#5E4B75';
        ctx.fillText('Dersimizden Notlar', 190, 145);

        ctx.font = 'italic 22px Georgia';
        ctx.fillStyle = '#8C7882';
        ctx.fillText(
            'Her ders yeni bir adım, her adım yeni bir keşif',
            190,
            185
        );

        // Başlık altı dekoratif çizgi
        const lineGradient = ctx.createLinearGradient(margin, 0, width - margin, 0);
        lineGradient.addColorStop(0, '#E6B8C2');
        lineGradient.addColorStop(0.5, '#8A76A6');
        lineGradient.addColorStop(1, '#E6B8C2');

        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(margin, headerHeight - 15);
        ctx.lineTo(width - margin, headerHeight - 15);
        ctx.stroke();

        // Bülten metni
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.font = '27px Arial';
        ctx.fillStyle = '#4A3E3D';

        let y = headerHeight + 45;

        lines.forEach(function (line) {
            if (!line) {
                y += 18;
                return;
            }

            ctx.fillText(line, margin, y);
            y += lineHeight;
        });

        // İmza alanı
        const footerY = canvas.height - footerHeight + 15;

        ctx.strokeStyle = '#E8D8DC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, footerY);
        ctx.lineTo(width - margin, footerY);
        ctx.stroke();

        ctx.textAlign = 'right';
        ctx.font = '20px Arial';
        ctx.fillStyle = '#8C7882';
        ctx.fillText('Matematik Öğretmeni', width - margin, footerY + 45);

        ctx.font = '30px Georgia';
        ctx.fillStyle = '#5E4B75';
        ctx.fillText('Zeynep Esra Arikan', width - margin, footerY + 85);

        

        canvas.toBlob(function (blob) {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Görsel oluşturulamadı.'));
            }
        }, 'image/png');
    });
}

            

    function installFeatures() {
        const area = document.getElementById('bulletinTextPreview');
        const group = document.getElementById('ekOzellikButonlari');

        if (!area || !group || group.dataset.pastelReady) return;
        group.dataset.pastelReady = 'true';

        group.style.gap = '10px';

        const buttons = group.querySelectorAll('button');
        buttons.forEach(function (button) {
            button.style.background = '#e9def3';
            button.style.color = '#59456b';
            button.style.border = '1px solid #ddcde9';
            button.style.borderRadius = '14px';
            button.style.padding = '12px 16px';
        });

        const imageButton = buttons[1];
        if (imageButton) {
            imageButton.textContent = '🎨 Pastel görseli kaydet';

            imageButton.onclick = async function () {
                try {
                    const blob = await createPastelImage();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'zeynep-esra-hoca-veli-bulteni.png';
                    link.click();
                    setTimeout(function () {
                        URL.revokeObjectURL(url);
                    }, 10000);
                } catch (error) {
                    alert('Görsel oluşturulamadı. Lütfen tekrar deneyin.');
                }
            };
        }

       
let shareButton = document.getElementById('pastelWhatsAppShare');

if (!shareButton) {
    shareButton = document.createElement('button');
    shareButton.id = 'pastelWhatsAppShare';
    shareButton.type = 'button';
    shareButton.textContent = '💌 WhatsApp’ta Görsel Paylaş';
    shareButton.style.cssText =
        'background:#dceee8;color:#315d52;border:1px solid #c6e2d9;' +
        'border-radius:14px;padding:12px 16px;font-size:14px;';

    shareButton.addEventListener('click', async function () {
        try {
            const blob = await createPastelImage();

            const file = new File(
                [blob],
                'veli-bulteni.png',
                { type: 'image/png' }
            );

            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({ files: [file] })
            ) {
                await navigator.share({
                    files: [file],
                    title: 'Veli Bülteni'
                });
            } else {
                alert(
                    'Bu cihaz doğrudan görsel paylaşımını desteklemiyor. ' +
                    'Görseli kaydet butonunu kullanabilirsiniz.'
                );
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                alert('Görsel paylaşımı açılamadı. Lütfen tekrar deneyin.');
            }
        }
    });

    group.appendChild(shareButton);
}
 


            group.appendChild(shareButton);
        }
    }

    function fixReminderText() {
        if (typeof window.generateBulletinText !== 'function') return;

        const original = window.generateBulletinText;
        if (original._reminderFixed) return;

        const wrapped = function () {
            original();

            if (typeof activeBulletinType === 'undefined' ||
                activeBulletinType !== 'reminder' ||
                !selectedLessonForBulletin) return;

            const lesson = selectedLessonForBulletin;
            const student = students.find(function (item) {
                return item.id == lesson.studentId;
            });

            if (!student) return;

            const branch = String(
                teacherProfile.branch || 'Matematik'
            ).replace(/\s*öğretmeni?\s*$/i, '').trim() || 'Matematik';

            const closing = document.getElementById('closingPhraseSelect');
            const phrase = closing ? closing.value : 'İyi günler dileriz.';
            const lowerPhrase =
                phrase.charAt(0).toLocaleLowerCase('tr-TR') + phrase.slice(1);

            document.getElementById('bulletinTextPreview').value =
                'Merhaba ' + (student.parentName || 'Sayın Velim') + ',\n\n' +
                'Yarın ' + student.name + ' ile ' +
                branch.toLocaleLowerCase('tr-TR') +
                ' dersimiz vardır. 😊\n\n' +
                'Bilginize sunar, ' + lowerPhrase + '\n\n' +
                'Zeynep Esra Hoca';
        };

        wrapped._reminderFixed = true;
        window.generateBulletinText = wrapped;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            installFeatures();
            fixReminderText();
        });
    } else {
        installFeatures();
        fixReminderText();
    }
})();

/* Hatırlatma metnindeki branş ifadesini düzelt */
(function () {
    const original = window.generateBulletinText;
    if (typeof original !== 'function') return;

    function corrected() {
        const result = original.apply(this, arguments);
        const area = document.getElementById('bulletinTextPreview');

        if (area && area.value) {
            area.value = area.value
                .replace(/matematik\s+öğretmeni\s+dersimiz/gi, 'matematik dersimiz')
                .replace(/matematik\s+öğretmeni\s+dersi/gi, 'matematik dersi')
                .replace(/\bMatematik Öğretmeni\b/g, 'matematik');
        }

        return result;
    }

    window.generateBulletinText = corrected;
})();


/* Kapanış ifadelerini ve ders tarihini düzenle */
(function () {
    'use strict';

    const kapanis = document.getElementById('closingPhraseSelect');

    if (kapanis) {
        const ifadeler = [
            ['İyi günler dilerim.', '☀️ İyi günler dilerim.'],
            ['İyi akşamlar dilerim.', '🌙 İyi akşamlar dilerim.'],
            ['İyi çalışmalar dilerim.', '🌟 İyi çalışmalar dilerim.'],
            ['Saygılarımla.', '🤝 Saygılarımla.']
        ];

        ifadeler.forEach(function (ifade, index) {
            if (kapanis.options[index]) {
                kapanis.options[index].value = ifade[0];
                kapanis.options[index].textContent = ifade[1];
            }
        });

        kapanis.selectedIndex = 0;
    }

    const oncekiOlustur = window.generateBulletinText;

    if (typeof oncekiOlustur !== 'function' ||
        oncekiOlustur._tarihVeKapanisDuzenlendi) {
        return;
    }

    function duzenlenmisBulten() {
        oncekiOlustur.apply(this, arguments);

        const alan = document.getElementById('bulletinTextPreview');
        const ders = window.selectedLessonForBulletin ||
            (typeof selectedLessonForBulletin !== 'undefined'
                ? selectedLessonForBulletin : null);

        if (!alan || !ders || !ders.date) return;

        const parcalar = ders.date.split('-');
        if (parcalar.length !== 3) return;

        const tarih = parcalar[2] + '.' +
            parcalar[1] + '.' + parcalar[0];

        if (typeof activeBulletinType !== 'undefined' &&
            activeBulletinType === 'summary') {
            alan.value = alan.value.replace(
                /ile yaptığımız dersin özeti aşağıdadır:/,
                'tarihinde yapmış olduğumuz derste işlediğimiz konular ve ödev bilgileri aşağıdadır:'
            );

            alan.value = alan.value.replace(
                'tarihinde yapmış olduğumuz derste',
                tarih + ' tarihinde yapmış olduğumuz derste'
            );
        }
    }

    duzenlenmisBulten._tarihVeKapanisDuzenlendi = true;
    window.generateBulletinText = duzenlenmisBulten;
})();

/* Dersimizden Notlar tasarım başlıkları */
(function () {
    'use strict';

    function basliklariDuzenle() {
        const eskiBasliklar = document.querySelectorAll(
            'h1, h2, h3, p, div, span'
        );

        eskiBasliklar.forEach(function (alan) {
            if (alan.children.length > 0) return;

            const yazi = (alan.textContent || '').trim();

            if (yazi === 'ÖZEL DERS • VELİ BÜLTENİ') {
                alan.textContent = 'Dersimizden Notlar';
            }

            if (yazi === 'Öğrenme yolculuğundan küçük bir not') {
                alan.textContent =
                    'Her ders yeni bir adım, her adım yeni bir keşif.';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            basliklariDuzenle
        );
    } else {
        basliklariDuzenle();
    }
})();

