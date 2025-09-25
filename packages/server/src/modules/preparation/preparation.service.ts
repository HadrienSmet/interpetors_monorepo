// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "../prisma";
// import { CreatePreparationDto } from "./dto";


// @Injectable()
// export class PreparationService {
//     constructor(private prisma: PrismaService) { }


//     async create(userId: string, dto: CreatePreparationDto) {
//         // 1. Créer la preparation (liée au workspace)
//         const preparation = await this.prisma.preparation.create({
//             data: {
//                 title: dto.title,
//                 workspace: { connect: { id: dto.workspaceId } },
//             },
//         });


//         // 2. Récursivement créer les dossiers, fichiers et tous les éléments
//         await this.createFolderTree(preparation.id, null, dto.foldersStructures);
//         // 3. Créer vocabulaire global si nécessaire
//         for (const vocab of dto.vocabulary.list) {
//             await this.prisma.vocabulary.create({
//                 data: {
//                     userId,
//                     workspaceId: dto.workspaceId,
//                     preparationId: preparation.id,
//                     translations: vocab.translations,
//                 },
//             });
//         }


//         return preparation;
//     }


//     private async createFolderTree(preparationId: string, parentFolderId: string | null, structure: any) {
//         for (const folderName in structure) {
//             const folderContent = structure[folderName];


//             const folder = await this.prisma.folder.create({
//                 data: {
//                     name: folderName,
//                     preparationId,
//                     parentFolderId,
//                 },
//             });


//             for (const fileName in folderContent) {
//                 const fileData = folderContent[fileName];


//                 const file = await this.prisma.file.create({
//                     data: {
//                         name: fileName,
//                         folderId: folder.id,
//                         path: fileData.path ?? "",
//                     },
//                 });


//                 const pageElements = fileData.elements || {};
//                 for (const pageIndex in pageElements) {
//                     const { pdfElements, notes, canvasElements, references, vocabulary } = pageElements[pageIndex];


//                     for (const el of pdfElements || []) {
//                         await this.prisma.pdfElement.create({
//                             data: {
//                                 type: el.type,
//                                 data: el.element,
//                                 pageIndex: Number(pageIndex),
//                                 fileId: file.id,
//                             },
//                         });
//                     }
//                     for (const note of notes || []) {
//                         // await this.prisma.note.create({
//                         //     data: {
//                         //         fileId: file.id,
//                         //         content: note.note,
//                         //         x: note.x ?? 0,
//                         //         y: note.y ?? 0,
//                         //         pageIndex: Number(pageIndex),
//                         //         height: note.height ?? 0,
//                         //         width: note.width ?? 0,
//                         //     },
//                         // });
//                         await this.prisma.pdfNote.create({
//                             data: {
//                                 fileId: file.id,
//                                 note: note.note,
//                                 x: note.x ?? 0,
//                                 y: note.y ?? 0,
//                                 pageIndex: Number(pageIndex),
//                                 height: note.height ?? 0,
//                                 width: note.width ?? 0,
//                             },
//                         });
//                     }


//                     for (const vocab of vocabulary || []) {
//                         await this.prisma.pdfVocabulary.create({
//                             data: {
//                                 fileId: file.id,
//                                 color: vocab.color,
//                                 translations: vocab.translations || {},
//                                 occurence: vocab.occurence,
//                             },
//                         });
//                     }
//                     for (const ref of references || []) {
//                         await this.prisma.reference.create({
//                             data: {
//                                 fileId: file.id,
//                                 type: ref.type,
//                                 reference_id: ref.element.id,
//                                 reference_type: ref.type.toUpperCase(),
//                             },
//                         });
//                     }
//                 }


//                 // Si sous-dossiers : appel récursif
//                 if (fileData.nested) {
//                     await this.createFolderTree(preparationId, folder.id, fileData.nested);
//                 }
//             }
//         }
//     }
// }
// src/preparations/preparations.service.ts

// import { Injectable, BadRequestException } from "@nestjs/common";
// import { Prisma } from "@prisma/client";
// import { PrismaService } from "../prisma/prisma.service";

// type ElementsPage = {
//     readonly canvasElements: any[]; // ignorés côté DB si tu ne veux pas les persister
//     notes: Array<{
//         color: string;
//         note: string;
//         id: string; // id temporaire côté client
//         occurence: any;
//         y: number;
//     }>;
//     pdfElements: Array<{
//         type: "rectangle" | "path" | "text";
//         element: any; // contient pageIndex + data spécifiques
//     }>;
//     references: Array<{
//         type: "note" | "vocabulary";
//         element: { id: string; pageIndex: number; x: number; y: number; width: number; height: number; };
//     }>;
//     vocabulary: Array<{
//         color: string;
//         id: string; // identifiant logique dans le client
//         occurence: any;
//         translations: Record<string, string>;
//     }>;
// };

// @Injectable()
// export class PreparationsService {
//     constructor(private readonly prisma: PrismaService) { }

//     async createFromClientPayload(workspaceId: string, params: any) {
//         const { title = ", foldersStructures = [], vocabulary = null } = params ?? {};
//         if (!Array.isArray(foldersStructures) || foldersStructures.length === 0) {
//             throw new BadRequestException("foldersStructures is required and must be a non-empty array.");
//         }

//         return this.prisma.$transaction(async (tx) => {
//             // 1) Création de la préparation
//             const workspace = await tx.workspace.findUnique({ where: { id: workspaceId } });
//             if (!workspace) throw new BadRequestException("Workspace not found");

//             const preparation = await tx.preparation.create({
//                 data: { title: title || ", workspaceId },
//             });

//             // Map temporaire: noteTempId -> realNoteId (par fichier)
//             // et vocabTempId (client) -> Vocabulary.id (global) OU null
//             const upsertVocabularyGlobal = async (list: any[]) => {
//                 const map = new Map<string, string>(); // clientId -> vocabularyId
//                 if (!Array.isArray(list)) return map;

//                 for (const v of list) {
//                     const term = (v?.occurence?.text ?? v?.id ?? ").toString().trim();
//                     if (!term) continue;

//                     const translations = v?.translations ?? {};
//                     const userId = workspace.userId;

//                     const vocab = await tx.vocabulary.upsert({
//                         where: { workspaceId_term: { workspaceId, term } },
//                         update: { translations: translations as Prisma.InputJsonValue, preparationId: preparation.id },
//                         create: {
//                             term,
//                             translations: translations as Prisma.InputJsonValue,
//                             userId,
//                             workspaceId,
//                             preparationId: preparation.id,
//                         },
//                     });

//                     map.set(v.id ?? term, vocab.id);
//                 }
//                 return map;
//             };

//             // 2) Upsert du vocabulaire global déclaré dans params.vocabulary.list
//             const globalVocabMap = await upsertVocabularyGlobal(vocabulary?.list ?? []);

//             // 3) Création récursive des dossiers/fichiers + contenus
//             const createFolderRecursive = async (
//                 parentFolderId: string | null,
//                 obj: Record<string, any>,
//                 pathPrefix: string,
//             ) => {
//                 // obj est soit { "folderName": {...} } ou { "fileName.pdf": fileObj }
//                 for (const entryName of Object.keys(obj)) {
//                     const value = obj[entryName];

//                     // Heuristique simple: si value a "elements" => c"est un fichier; sinon c"est un dossier
//                     const isFile = value && typeof value === "object" && "elements" in value;

//                     if (isFile) {
//                         const filePath = pathPrefix ? `${pathPrefix}/${entryName}` : entryName;

//                         const file = await tx.file.create({
//                             data: {
//                                 name: value.name ?? entryName,
//                                 path: filePath,
//                                 folder: { connect: { id: parentFolderId! } },
//                             },
//                         });

//                         // Ingestion des pages
//                         const elements: Record<string, ElementsPage> = value.elements ?? {};
//                         // 3.1 PDF elements
//                         for (const pageKey of Object.keys(elements)) {
//                             const page = elements[pageKey];
//                             // pdfElements
//                             for (const pe of page.pdfElements ?? []) {
//                                 const t = (pe.type ?? ").toUpperCase();
//                                 const type: "PATH" | "RECTANGLE" | "TEXT" =
//                                     t === "PATH" ? "PATH" : t === "TEXT" ? "TEXT" : "RECTANGLE";

//                                 const pageIndex = pe.element?.pageIndex ?? 1;

//                                 await tx.pdfElement.create({
//                                     data: {
//                                         fileId: file.id,
//                                         pageIndex,
//                                         type,
//                                         data: pe.element as Prisma.InputJsonValue,
//                                     },
//                                 });
//                             }
//                         }

//                         // 3.2 Notes (unifiées)
//                         // noteTempId -> realId
//                         const noteIdMap = new Map<string, string>();

//                         for (const pageKey of Object.keys(elements)) {
//                             const page = elements[pageKey];
//                             const pageIndex = Number(pageKey);

//                             for (const n of page.notes ?? []) {
//                                 const note = await tx.note.create({
//                                     data: {
//                                         fileId: file.id,
//                                         content: n.note ?? ",
//                                         pageIndex: pageIndex || n.occurence?.pageIndex || 1,
//                                         color: n.color ?? null,
//                                         occurence: (n.occurence ?? null) as Prisma.InputJsonValue,
//                                         x: null,
//                                         y: Number.isFinite(n.y) ? Math.floor(n.y) : null,
//                                         width: null,
//                                         height: 14, // valeur par défaut du payload
//                                     },
//                                 });
//                                 if (n.id) noteIdMap.set(n.id, note.id);
//                             }
//                         }

//                         // 3.3 PdfVocabulary (occurrences) + lien optionnel vers vocab global
//                         for (const pageKey of Object.keys(elements)) {
//                             const page = elements[pageKey];
//                             for (const pv of page.vocabulary ?? []) {
//                                 const vocabId = globalVocabMap.get(pv.id) ?? null;
//                                 await tx.pdfVocabulary.create({
//                                     data: {
//                                         fileId: file.id,
//                                         color: pv.color ?? "rgb(51, 255, 0)",
//                                         occurence: (pv.occurence ?? {}) as Prisma.InputJsonValue,
//                                         translations: (pv.translations ?? {}) as Prisma.InputJsonValue,
//                                         vocabularyId: vocabId,
//                                     },
//                                 });
//                             }
//                         }

//                         // 3.4 References (zones cliquables vers Note ou Vocabulary)
//                         for (const pageKey of Object.keys(elements)) {
//                             const page = elements[pageKey];
//                             for (const r of page.references ?? []) {
//                                 const el = r.element ?? {};
//                                 const pageIndex = el.pageIndex ?? 1;

//                                 let noteId: string | null = null;
//                                 let vocabularyId: string | null = null;

//                                 if (r.type === "note") {
//                                     // r.element.id est l"id "temporaire" côté client (e.g. "51-255-0-1")
//                                     noteId = noteIdMap.get(el.id) ?? null;
//                                 } else if (r.type === "vocabulary") {
//                                     // r.element.id est l"id côté client dans la liste de vocab
//                                     vocabularyId = globalVocabMap.get(el.id) ?? null;
//                                 }

//                                 await tx.reference.create({
//                                     data: {
//                                         fileId: file.id,
//                                         type: r.type === "note" ? "NOTE" : "VOCABULARY",
//                                         noteId,
//                                         vocabularyId,
//                                         pageIndex,
//                                         x: Math.floor(el.x ?? 0),
//                                         y: Math.floor(el.y ?? 0),
//                                         width: Math.floor(el.width ?? 0),
//                                         height: Math.floor(el.height ?? 0),
//                                     },
//                                 });
//                             }
//                         }
//                     } else {
//                         // Dossier
//                         const folderName = entryName;
//                         const folder = await tx.folder.create({
//                             data: {
//                                 name: folderName,
//                                 preparationId: preparation.id,
//                                 parentFolderId: parentFolderId,
//                             },
//                         });

//                         const child = value ?? {};
//                         await createFolderRecursive(
//                             folder.id,
//                             child,
//                             pathPrefix ? `${pathPrefix}/${folderName}` : folderName,
//                         );
//                     }
//                 }
//             };

//             // La racine côté client est un array d’objets “{ folderName: {...} }”
//             for (const root of foldersStructures) {
//                 // Crée un dossier racine virtuel si tu veux; sinon on itère direct
//                 await createFolderRecursive(null, root, ");
//             }

//             return { id: preparation.id };
//         });
//     }
// }
