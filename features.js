
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

            const govde = document.createElement('pre');
            govde.textContent = metin;
            govde.style.cssText =
                'white-space:pre-wrap;font:16px Arial;line-height:1.8;' +
                'overflow-wrap:break-word;';

            pencere.document.title = 'Veli Bülteni';
            pencere.document.body.style.cssText =
                'font-family:Arial,sans-serif;padding:35px;color:#26334a;';
            pencere.document.body.appendChild(govde);

            const stil = pencere.document.createElement('style');
            stil.textContent =
                '@media print { body { padding: 15mm !important; } }';
            pencere.document.head.appendChild(stil);

            pencere.focus();
            setTimeout(function () {
                pencere.print();
            }, 300);
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
