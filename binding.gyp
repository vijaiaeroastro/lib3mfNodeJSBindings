{
  "targets": [
    {
      "target_name": "lib3mf_nodeaddon",
      "sources": [
        "lib3mf_nodeaddon.cc",
        "lib3mf_nodewrapper.cc",
        "lib3mf_dynamic.cc"
      ],
      "cflags": ["-fexceptions"],
      "cflags_cc": ["-fexceptions"],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1
        }
      },
      "conditions": [
        ["OS=='win'", {
          "defines": ["_HAS_EXCEPTIONS=1"]
        }],
        ["OS=='mac'", {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
          }
        }]
      ]
    }
  ]
}