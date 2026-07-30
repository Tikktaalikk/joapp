// Lot 1/7 environ — Oiseaux des jardins et villes (partie 1)
const BIRDS = [
  { id: 1, lot: 1, name: "Rouge-gorge familier", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Erithacus_rubecula_-_European_robin_02.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Erithacus_rubecula_profile.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/030_European_robin_in_the_Camargue_Photo_by_Giles_Laurent.jpg?width=500"
  ]},
  { id: 2, lot: 1, name: "Mésange bleue", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Cyanistes_caeruleus_Blue_Tit.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Cyanistes_caeruleus_I.jpg?width=500"
  ]},
  { id: 3, lot: 1, name: "Merle noir", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Merle_noir_ile_de_france.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Merlo_Ifroz.jpg?width=500"
  ]},
  { id: 4, lot: 1, name: "Moineau domestique", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Passer_domesticus_detailed.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Passer_domesticus_img_2343.jpg?width=500"
  ]},
  { id: 5, lot: 1, name: "Pigeon ramier", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Wood_pidgeon_Columba_palumbus.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Columba_palumbus_-twig_in_beak-8.jpg?width=500"
  ]},
  { id: 6, lot: 1, name: "Mésange charbonnière", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Parus_major_Luc_Viatour.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Parus_major_m.jpg?width=500"
  ]},
  { id: 7, lot: 1, name: "Chardonneret élégant", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Carduelis_carduelis_close_up.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Carduelis_carduelis_tengelic.JPG?width=500"
  ]},
  { id: 8, lot: 1, name: "Pinson des arbres", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Male_Chaffinch_-_Fringilla_coelebs.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fringilla_coelebs_male_Buchfink-3264.jpg?width=500"
  ]},
  { id: 9, lot: 1, name: "Étourneau sansonnet", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Star_Sturnus_vulgaris.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sturnus_vulgaris_-California-8.jpg?width=500"
  ]},
  { id: 10, lot: 1, name: "Corneille noire", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Carrion_Crow_aka_Corvus_corone.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Corvus_corone_Georges_Valbon_2022_03_18_01.jpg?width=500"
  ]},
  { id: 11, lot: 1, name: "Pie bavarde", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Pica_pica1.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/PiePica_pica.jpg?width=500"
  ]},
  { id: 12, lot: 1, name: "Tourterelle turque", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Streptopelia_decaocto_-_Eurasian_Collared_Dove_05.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Streptopelia_decaocto_-_Gugutka.jpg?width=500"
  ]},
  { id: 13, lot: 1, name: "Verdier d'Europe", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Greenfinch_Carduelis_chloris.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Carduelis_chloris_-England-8.jpg?width=500"
  ]},
  { id: 14, lot: 1, name: "Rougequeue noir", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Black_redstart_(Phoenicurus_ochruros).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Black_Redstart_1741710093187.jpg?width=500"
  ]},
  { id: 15, lot: 1, name: "Troglodyte mignon", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Troglodytes_troglodytes_fumigatus.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Troglodytes_troglodytes_2zz.jpg?width=500"
  ]},
  { id: 16, lot: 1, name: "Accenteur mouchet", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Prunella_modularis.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Prunella_modularis-crop.jpg?width=500"
  ]},
  { id: 17, lot: 1, name: "Fauvette à tête noire", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sylvia_atricapilla_no.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sylvia_atricapilla_male_2.jpg?width=500"
  ]},
  { id: 18, lot: 1, name: "Pigeon biset (urbain)", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Columba_livia.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Columba_livia_1.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Columba_livia_in_Japan.JPG?width=500"
  ]},
  { id: 19, lot: 1, name: "Serin cini", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/European_serin_(Serinus_serinus)_male.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/European_serin_(Serinus_serinus)_female.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/European_serin_(Serinus_serinus)_male_Morocco.jpg?width=500"
  ]},
  { id: 20, lot: 1, name: "Bergeronnette grise", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Motacilla_alba_alba.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Motacilla_alba_alba_cropped.JPG?width=500"
  ]},
  { id: 21, lot: 1, name: "Hirondelle rustique", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hirundo_rustica_Ormoz.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hirundo_rustica_14116.JPG?width=500"
  ]},
  { id: 22, lot: 1, name: "Hirondelle de fenêtre", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Delichon_urbicum_Oulu_20120527_04.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bysvale.jpg?width=500"
  ]},
  { id: 23, lot: 1, name: "Martinet noir", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Apus_apus_01.jpg?width=500"
  ]},
  { id: 24, lot: 1, name: "Choucas des tours", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Corvus_monedula_01.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Corvus_monedula_-Netherlands-8.jpg?width=500"
  ]},
  { id: 25, lot: 1, name: "Corbeau freux", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Corvus_frugilegus_2.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Corvus_frugilegus_MWNH_2327.JPG?width=500"
  ]},

  // Lot 2/7 — Mésanges, sittelle, grimpereaux, roitelet huppé
  { id: 26, lot: 2, name: "Mésange noire", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Coal_tit_UK09.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Svartmeis._Periparus_ater.jpg?width=500"
  ]},
  { id: 27, lot: 2, name: "Mésange nonnette", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Parus_palustris02.jpg?width=500"
  ]},
  { id: 28, lot: 2, name: "Mésange huppée", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Crested_Tit_(Lophophanes_cristatus)_(3).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Crested_Tit_(Lophophanes_cristatus)_(4).jpg?width=500"
  ]},
  { id: 29, lot: 2, name: "Mésange à longue queue", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Aegithalos_caudatus_trivirgatus_0s9.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Aegithalos_caudatus_trivirgatus_eating_insect.JPG?width=500"
  ]},
  { id: 30, lot: 2, name: "Sittelle torchepot", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sitta_europaea_in_Wales_UK.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sitta_europaea_wildlife_2_1.jpg?width=500"
  ]},
  { id: 31, lot: 2, name: "Grimpereau des jardins", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Short-toed_Treecreeper_(Certhia_brachydactyla).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Certhia_brachydactyla_(Madrid,_Spain)_002.jpg?width=500"
  ]},
  { id: 32, lot: 2, name: "Grimpereau des bois", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Porr_(Certhia_familiaris).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Certhia_familiaris_Rome_20130304.jpg?width=500"
  ]},
  { id: 33, lot: 2, name: "Roitelet huppé", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Regulus_1.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Goudhaantje_Regulus_regulus_Jos_Zwarts_2.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Regulus_regulus_japonensis.JPG?width=500"
  ]},

  // Lot 3/7 — Roitelet à triple bandeau, pouillots, fauvettes
  { id: 34, lot: 3, name: "Roitelet à triple bandeau", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Regulus_ignicapilla_Arundel.jpg?width=500"
  ]},
  { id: 35, lot: 3, name: "Pouillot véloce", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Chiffchaff_(Phylloscopus_collybita).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Gransanger_(Phylloscopus_collybita).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Phylloscopus_collybita.png?width=500"
  ]},
  { id: 36, lot: 3, name: "Pouillot fitis", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Willow_Warbler_Phylloscopus_trochilus.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/L%C3%B6vs%C3%A5ngare_Willow_Warbler_(20357278301).jpg?width=500"
  ]},
  { id: 37, lot: 3, name: "Pouillot de Bonelli", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Phylloscopus_bonelli_2.jpg?width=500"
  ]},
  { id: 38, lot: 3, name: "Fauvette grisette", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sylvia_communis_(Dorngrasm%C3%BCcke)_2013-08-15_01.jpg?width=500"
  ]},
  { id: 39, lot: 3, name: "Fauvette des jardins", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Garden_Warbler_1.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Warbler.JPG?width=500"
  ]},
  { id: 40, lot: 3, name: "Fauvette babillarde", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fauvette_babillarde._-_Flickr_-_Ferdinand23.jpg?width=500"
  ]},
  { id: 41, lot: 3, name: "Fauvette mélanocéphale", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sardinian_warbler_(Sylvia_melanocephala)_female.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sardinian_warbler_(Sylvia_melanocephala).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sardinian_Warbler.jpg?width=500"
  ]},
  { id: 42, lot: 3, name: "Locustelle tachetée", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Common_Grasshopper_Warbler_by_Tisha_Mukherjee_01.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Common_Grasshopper_Warbler_by_Tisha_Mukherjee_02.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Grashoppsangare-070512.jpg?width=500"
  ]},

  // Lot 4/7 — Pics et torcol fourmilier
  { id: 43, lot: 4, name: "Pic épeiche", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dendrocopos_major.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/DendrocoposMajor.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dendrocopos_major_MHNT_232.jpg?width=500"
  ]},
  { id: 44, lot: 4, name: "Pic vert", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Picus_viridis_1.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Picus_viridis_juv(ThKraft).jpg?width=500"
  ]},
  { id: 45, lot: 4, name: "Pic mar", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dendrocopos_medius_(Marek_Szczepanek).jpg?width=500"
  ]},
  { id: 46, lot: 4, name: "Pic noir", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dryocopus_martius.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Pic_noir_-_Dryocopus_martius.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Black_woodpecker_(Dryocopus_martius).jpg?width=500"
  ]},
  { id: 47, lot: 4, name: "Pic épeichette", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dendrocopos_minor_291108.jpg?width=500"
  ]},
  { id: 48, lot: 4, name: "Torcol fourmilier", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jynx_torquilla_no.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jynx_torquilla_-_Jyntor.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Jynx_torquilla.jpg?width=500"
  ]},

  // Lot 5/7 — Grives et merle à plastron
  { id: 49, lot: 5, name: "Grive musicienne", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Song_thrush.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Song_Thrush-Mindaugas_Urbonas-3.jpg?width=500"
  ]},
  { id: 50, lot: 5, name: "Grive draine", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mistle_thrush.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Turdus_viscivorus_Brych_y_coed.jpg?width=500"
  ]},
  { id: 51, lot: 5, name: "Grive litorne", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Turdus_pilaris_no.JPG?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Turdus_pilaris2.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fieldfare_aka_Turdus_pilaris.jpg?width=500"
  ]},
  { id: 52, lot: 5, name: "Grive mauvis", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Redwing_Turdus_iliacus.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Redwingsm.JPG?width=500"
  ]},
  { id: 53, lot: 5, name: "Merle à plastron", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ring_Ouzel.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Alpine_Ring_Ouzel_(Turdus_torquatus),_Karwendel_mountains,_Austria_(5756291760).jpg?width=500"
  ]},

  // Lot 6/7 — Rapaces diurnes
  { id: 54, lot: 6, name: "Faucon crécerelle", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Common_Kestrel_2.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Falco_tinnunculus_NRM.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Common_Kestrel_1.jpg?width=500"
  ]},
  { id: 55, lot: 6, name: "Buse variable", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Buteo_buteo_6_(Marek_Szczepanek).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Buteo_buteo_2_(Marek_Szczepanek).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Buteo_buteo_-Scotland-8.jpg?width=500"
  ]},
  { id: 56, lot: 6, name: "Épervier d'Europe", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Accipiter_nisus.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Accipiter_nisus_edit.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Accipiter_nisus_kill.jpg?width=500"
  ]},
  { id: 57, lot: 6, name: "Milan noir", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Milvus_migrans_0zz.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Milvus_migrans_2005-new.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Milvus_migrans_front(ThKraft).jpg?width=500"
  ]},
  { id: 58, lot: 6, name: "Milan royal", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Milvus_milvus_(portrait).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Milvus_milvus_R(ThKraft).jpg?width=500"
  ]},
  { id: 59, lot: 6, name: "Busard Saint-Martin", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Circus_cyaneus_265961899.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Circus_cyaneus_29096.JPG?width=500"
  ]},
  { id: 60, lot: 6, name: "Busard cendré", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Circus_pygargus_(33541975444).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Circus_pygargus_juvenile_perch.jpg?width=500"
  ]},
  { id: 61, lot: 6, name: "Bondrée apivore", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/European_honey_buzzard_-_Pernis_apivorus.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Beine_Wespenbussard-.jpg?width=500"
  ]},
  { id: 62, lot: 6, name: "Autour des palombes", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Northern_Goshawk_ad_M2.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Accipiter_gentilis_by_Iosto_Doneddu.jpg?width=500"
  ]},
  { id: 63, lot: 6, name: "Faucon hobereau", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kobuz_(Falco_subbuteo).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hobby_(Falco_subbuteo).jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Falco_subbuteo_kobuz1.jpg?width=500"
  ]},
  { id: 64, lot: 6, name: "Aigle botté", images: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/AquilaPennata.jpg?width=500",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Booted_Eagle_(Hieraaetus_pennatus)_(2821390977).jpg?width=500"
  ]}
];

// Catalogue des lots, utilisé par l'écran de sélection et par le jeu
const LOTS = [
  { id: 1, name: "Oiseaux des jardins et villes" },
  { id: 2, name: "Mésanges, sittelle et grimpereaux" },
  { id: 3, name: "Roitelets, pouillots et fauvettes" },
  { id: 4, name: "Pics et torcol" },
  { id: 5, name: "Grives et merle à plastron" },
  { id: 6, name: "Rapaces diurnes" }
];