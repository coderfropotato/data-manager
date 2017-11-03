var convert = function (data) {
    var list = {};
    loop(list,data.result.tree)
    function loop(list,arr){
        for (var i=0;i<arr.length;i++){
            var cur = arr[i];
            list[i]=[];
            var obj = {};
            var child = [];
            for(var name in cur){
                if(cur[name].child) child.push(cur[name].child)
                obj.name = name;
                obj.isdir = cur[name].isdir;
                obj.ctime = cur[name].ctime;
                obj.mtime = cur[name].mtime;
                obj.size = cur[name].size;
                obj.path = cur[name].path;
                list[i].push(obj);
            }
        }
        console.log(child);
        if(child.length){
            return; 
            loop(list,child)
        }else{
            console.log(list)
            return list;
        }
    }

    /* 
        {
        "result": {
            "tree": [
                {
                    "chipseq": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-11-02",
                        "size": "122.65KB",
                        "path": "D:/data/report-api/report_api/api/chipseq",
                        "child": {
                            "chipseq.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "69.51KB",
                                "path": "D:/data/report-api/report_api/api/chipseq/chipseq.py"
                            },
                            "chip_menu.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "12.37KB",
                                "path": "D:/data/report-api/report_api/api/chipseq/chip_menu.py"
                            },
                            "__init__.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "0.25KB",
                                "path": "D:/data/report-api/report_api/api/chipseq/__init__.py"
                            },
                            "__pycache__": {
                                "isdir": true,
                                "ctime": "2017-09-18",
                                "mtime": "2017-10-25",
                                "size": "40.52KB",
                                "path": "D:/data/report-api/report_api/api/chipseq/__pycache__",
                                "child": {
                                    "chipseq.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "35.94KB",
                                        "path": "D:/data/report-api/report_api/api/chipseq/__pycache__/chipseq.cpython-36.pyc"
                                    },
                                    "chip_menu.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "4.24KB",
                                        "path": "D:/data/report-api/report_api/api/chipseq/__pycache__/chip_menu.cpython-36.pyc"
                                    },
                                    "__init__.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "0.33KB",
                                        "path": "D:/data/report-api/report_api/api/chipseq/__pycache__/__init__.cpython-36.pyc"
                                    }
                                }
                            }
                        }
                    },
                    "dna": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-11-02",
                        "size": "95.72KB",
                        "path": "D:/data/report-api/report_api/api/dna",
                        "child": {
                            "dna_ch.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "6.52KB",
                                "path": "D:/data/report-api/report_api/api/dna/dna_ch.py"
                            },
                            "dna_hnz.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "3.28KB",
                                "path": "D:/data/report-api/report_api/api/dna/dna_hnz.py"
                            },
                            "dna_menu.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "17.52KB",
                                "path": "D:/data/report-api/report_api/api/dna/dna_menu.py"
                            },
                            "dna_yxy.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "8.43KB",
                                "path": "D:/data/report-api/report_api/api/dna/dna_yxy.py"
                            },
                            "dna_zjc.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "4.41KB",
                                "path": "D:/data/report-api/report_api/api/dna/dna_zjc.py"
                            },
                            "dna_zmm.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "18.40KB",
                                "path": "D:/data/report-api/report_api/api/dna/dna_zmm.py"
                            },
                            "dna_ztj.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "3.19KB",
                                "path": "D:/data/report-api/report_api/api/dna/dna_ztj.py"
                            },
                            "__init__.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "0.36KB",
                                "path": "D:/data/report-api/report_api/api/dna/__init__.py"
                            },
                            "__pycache__": {
                                "isdir": true,
                                "ctime": "2017-09-18",
                                "mtime": "2017-10-26",
                                "size": "33.63KB",
                                "path": "D:/data/report-api/report_api/api/dna/__pycache__",
                                "child": {
                                    "dna_ch.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "5.02KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/dna_ch.cpython-36.pyc"
                                    },
                                    "dna_hnz.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "2.71KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/dna_hnz.cpython-36.pyc"
                                    },
                                    "dna_menu.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "3.37KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/dna_menu.cpython-36.pyc"
                                    },
                                    "dna_yxy.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "6.06KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/dna_yxy.cpython-36.pyc"
                                    },
                                    "dna_zjc.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "3.73KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/dna_zjc.cpython-36.pyc"
                                    },
                                    "dna_zmm.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "9.99KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/dna_zmm.cpython-36.pyc"
                                    },
                                    "dna_ztj.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "2.27KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/dna_ztj.cpython-36.pyc"
                                    },
                                    "__init__.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "0.47KB",
                                        "path": "D:/data/report-api/report_api/api/dna/__pycache__/__init__.cpython-36.pyc"
                                    }
                                }
                            }
                        }
                    },
                    "gwas": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-11-02",
                        "size": "70.11KB",
                        "path": "D:/data/report-api/report_api/api/gwas",
                        "child": {
                            "gwas.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "17.97KB",
                                "path": "D:/data/report-api/report_api/api/gwas/gwas.py"
                            },
                            "gwas_hnz.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "6.81KB",
                                "path": "D:/data/report-api/report_api/api/gwas/gwas_hnz.py"
                            },
                            "gwas_menu.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "5.79KB",
                                "path": "D:/data/report-api/report_api/api/gwas/gwas_menu.py"
                            },
                            "gwas_yxy.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "6.34KB",
                                "path": "D:/data/report-api/report_api/api/gwas/gwas_yxy.py"
                            },
                            "gwas_zjc.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "5.22KB",
                                "path": "D:/data/report-api/report_api/api/gwas/gwas_zjc.py"
                            },
                            "__init__.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "0.31KB",
                                "path": "D:/data/report-api/report_api/api/gwas/__init__.py"
                            },
                            "__pycache__": {
                                "isdir": true,
                                "ctime": "2017-09-18",
                                "mtime": "2017-10-30",
                                "size": "27.67KB",
                                "path": "D:/data/report-api/report_api/api/gwas/__pycache__",
                                "child": {
                                    "gwas.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-30",
                                        "mtime": "2017-10-30",
                                        "size": "11.71KB",
                                        "path": "D:/data/report-api/report_api/api/gwas/__pycache__/gwas.cpython-36.pyc"
                                    },
                                    "gwas_hnz.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "4.32KB",
                                        "path": "D:/data/report-api/report_api/api/gwas/__pycache__/gwas_hnz.cpython-36.pyc"
                                    },
                                    "gwas_menu.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "2.29KB",
                                        "path": "D:/data/report-api/report_api/api/gwas/__pycache__/gwas_menu.cpython-36.pyc"
                                    },
                                    "gwas_yxy.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-30",
                                        "mtime": "2017-10-30",
                                        "size": "4.64KB",
                                        "path": "D:/data/report-api/report_api/api/gwas/__pycache__/gwas_yxy.cpython-36.pyc"
                                    },
                                    "gwas_zjc.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "4.33KB",
                                        "path": "D:/data/report-api/report_api/api/gwas/__pycache__/gwas_zjc.cpython-36.pyc"
                                    },
                                    "__init__.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "0.37KB",
                                        "path": "D:/data/report-api/report_api/api/gwas/__pycache__/__init__.cpython-36.pyc"
                                    }
                                }
                            }
                        }
                    },
                    "its": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-11-02",
                        "size": "74.05KB",
                        "path": "D:/data/report-api/report_api/api/its",
                        "child": {
                            "its_menu.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "21.44KB",
                                "path": "D:/data/report-api/report_api/api/its/its_menu.py"
                            },
                            "its_yxy.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "28.26KB",
                                "path": "D:/data/report-api/report_api/api/its/its_yxy.py"
                            },
                            "__init__.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "0.24KB",
                                "path": "D:/data/report-api/report_api/api/its/__init__.py"
                            },
                            "__pycache__": {
                                "isdir": true,
                                "ctime": "2017-09-18",
                                "mtime": "2017-10-26",
                                "size": "24.12KB",
                                "path": "D:/data/report-api/report_api/api/its/__pycache__",
                                "child": {
                                    "its_menu.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "7.12KB",
                                        "path": "D:/data/report-api/report_api/api/its/__pycache__/its_menu.cpython-36.pyc"
                                    },
                                    "its_yxy.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "16.67KB",
                                        "path": "D:/data/report-api/report_api/api/its/__pycache__/its_yxy.cpython-36.pyc"
                                    },
                                    "__init__.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "0.32KB",
                                        "path": "D:/data/report-api/report_api/api/its/__pycache__/__init__.cpython-36.pyc"
                                    }
                                }
                            }
                        }
                    },
                    "mirna": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-11-02",
                        "size": "207.96KB",
                        "path": "D:/data/report-api/report_api/api/mirna",
                        "child": {
                            "mirna_ch.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "42.98KB",
                                "path": "D:/data/report-api/report_api/api/mirna/mirna_ch.py"
                            },
                            "mirna_menu.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "27.87KB",
                                "path": "D:/data/report-api/report_api/api/mirna/mirna_menu.py"
                            },
                            "mirna_ys.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "31.94KB",
                                "path": "D:/data/report-api/report_api/api/mirna/mirna_ys.py"
                            },
                            "mirna_zjc.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "35.43KB",
                                "path": "D:/data/report-api/report_api/api/mirna/mirna_zjc.py"
                            },
                            "__init__.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "0.30KB",
                                "path": "D:/data/report-api/report_api/api/mirna/__init__.py"
                            },
                            "__pycache__": {
                                "isdir": true,
                                "ctime": "2017-09-18",
                                "mtime": "2017-10-26",
                                "size": "69.43KB",
                                "path": "D:/data/report-api/report_api/api/mirna/__pycache__",
                                "child": {
                                    "mirna_ch.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "24.52KB",
                                        "path": "D:/data/report-api/report_api/api/mirna/__pycache__/mirna_ch.cpython-36.pyc"
                                    },
                                    "mirna_menu.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "7.95KB",
                                        "path": "D:/data/report-api/report_api/api/mirna/__pycache__/mirna_menu.cpython-36.pyc"
                                    },
                                    "mirna_ys.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "17.23KB",
                                        "path": "D:/data/report-api/report_api/api/mirna/__pycache__/mirna_ys.cpython-36.pyc"
                                    },
                                    "mirna_zjc.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "19.33KB",
                                        "path": "D:/data/report-api/report_api/api/mirna/__pycache__/mirna_zjc.cpython-36.pyc"
                                    },
                                    "__init__.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "0.40KB",
                                        "path": "D:/data/report-api/report_api/api/mirna/__pycache__/__init__.cpython-36.pyc"
                                    }
                                }
                            }
                        }
                    },
                    "mrna": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-11-02",
                        "size": "265.02KB",
                        "path": "D:/data/report-api/report_api/api/mrna",
                        "child": {
                            "mrna_ch.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "63.70KB",
                                "path": "D:/data/report-api/report_api/api/mrna/mrna_ch.py"
                            },
                            "mrna_menu.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "18.15KB",
                                "path": "D:/data/report-api/report_api/api/mrna/mrna_menu.py"
                            },
                            "mrna_ys.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "22.09KB",
                                "path": "D:/data/report-api/report_api/api/mrna/mrna_ys.py"
                            },
                            "mrna_zjc.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "69.11KB",
                                "path": "D:/data/report-api/report_api/api/mrna/mrna_zjc.py"
                            },
                            "__init__.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "0.29KB",
                                "path": "D:/data/report-api/report_api/api/mrna/__init__.py"
                            },
                            "__pycache__": {
                                "isdir": true,
                                "ctime": "2017-09-18",
                                "mtime": "2017-10-26",
                                "size": "91.68KB",
                                "path": "D:/data/report-api/report_api/api/mrna/__pycache__",
                                "child": {
                                    "mrna_ch.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "35.39KB",
                                        "path": "D:/data/report-api/report_api/api/mrna/__pycache__/mrna_ch.cpython-36.pyc"
                                    },
                                    "mrna_menu.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "7.19KB",
                                        "path": "D:/data/report-api/report_api/api/mrna/__pycache__/mrna_menu.cpython-36.pyc"
                                    },
                                    "mrna_ys.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "13.75KB",
                                        "path": "D:/data/report-api/report_api/api/mrna/__pycache__/mrna_ys.cpython-36.pyc"
                                    },
                                    "mrna_zjc.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "34.96KB",
                                        "path": "D:/data/report-api/report_api/api/mrna/__pycache__/mrna_zjc.cpython-36.pyc"
                                    },
                                    "__init__.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "0.39KB",
                                        "path": "D:/data/report-api/report_api/api/mrna/__pycache__/__init__.cpython-36.pyc"
                                    }
                                }
                            }
                        }
                    },
                    "rna16s": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-11-02",
                        "size": "113.22KB",
                        "path": "D:/data/report-api/report_api/api/rna16s",
                        "child": {
                            "rna16s_ch.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "11.31KB",
                                "path": "D:/data/report-api/report_api/api/rna16s/rna16s_ch.py"
                            },
                            "rna16s_menu.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "21.87KB",
                                "path": "D:/data/report-api/report_api/api/rna16s/rna16s_menu.py"
                            },
                            "rna16s_ys.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "7.47KB",
                                "path": "D:/data/report-api/report_api/api/rna16s/rna16s_ys.py"
                            },
                            "rna16s_yxy.py": {
                                "isdir": false,
                                "ctime": "2017-09-18",
                                "mtime": "2017-09-18",
                                "size": "9.43KB",
                                "path": "D:/data/report-api/report_api/api/rna16s/rna16s_yxy.py"
                            },
                            "rna16s_zjc.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "23.11KB",
                                "path": "D:/data/report-api/report_api/api/rna16s/rna16s_zjc.py"
                            },
                            "__init__.py": {
                                "isdir": false,
                                "ctime": "2017-11-02",
                                "mtime": "2017-11-02",
                                "size": "0.34KB",
                                "path": "D:/data/report-api/report_api/api/rna16s/__init__.py"
                            },
                            "__pycache__": {
                                "isdir": true,
                                "ctime": "2017-09-18",
                                "mtime": "2017-10-26",
                                "size": "39.69KB",
                                "path": "D:/data/report-api/report_api/api/rna16s/__pycache__",
                                "child": {
                                    "rna16s_ch.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "7.20KB",
                                        "path": "D:/data/report-api/report_api/api/rna16s/__pycache__/rna16s_ch.cpython-36.pyc"
                                    },
                                    "rna16s_menu.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "7.14KB",
                                        "path": "D:/data/report-api/report_api/api/rna16s/__pycache__/rna16s_menu.cpython-36.pyc"
                                    },
                                    "rna16s_ys.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "4.29KB",
                                        "path": "D:/data/report-api/report_api/api/rna16s/__pycache__/rna16s_ys.cpython-36.pyc"
                                    },
                                    "rna16s_yxy.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-09-18",
                                        "mtime": "2017-09-18",
                                        "size": "6.34KB",
                                        "path": "D:/data/report-api/report_api/api/rna16s/__pycache__/rna16s_yxy.cpython-36.pyc"
                                    },
                                    "rna16s_zjc.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-26",
                                        "mtime": "2017-10-26",
                                        "size": "14.29KB",
                                        "path": "D:/data/report-api/report_api/api/rna16s/__pycache__/rna16s_zjc.cpython-36.pyc"
                                    },
                                    "__init__.cpython-36.pyc": {
                                        "isdir": false,
                                        "ctime": "2017-10-25",
                                        "mtime": "2017-10-25",
                                        "size": "0.44KB",
                                        "path": "D:/data/report-api/report_api/api/rna16s/__pycache__/__init__.cpython-36.pyc"
                                    }
                                }
                            }
                        }
                    },
                    "__init__.py": {
                        "isdir": false,
                        "ctime": "2017-11-02",
                        "mtime": "2017-11-02",
                        "size": "0.32KB",
                        "path": "D:/data/report-api/report_api/api/__init__.py"
                    },
                    "__pycache__": {
                        "isdir": true,
                        "ctime": "2017-09-18",
                        "mtime": "2017-10-25",
                        "size": "0.40KB",
                        "path": "D:/data/report-api/report_api/api/__pycache__",
                        "child": {
                            "__init__.cpython-36.pyc": {
                                "isdir": false,
                                "ctime": "2017-10-25",
                                "mtime": "2017-10-25",
                                "size": "0.40KB",
                                "path": "D:/data/report-api/report_api/api/__pycache__/__init__.cpython-36.pyc"
                            }
                        }
                    }
                }
            ]
        }
    }
    */
}

export default convert;