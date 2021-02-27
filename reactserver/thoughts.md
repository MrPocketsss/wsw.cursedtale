# Phone App

- Every part of UI should be customizable
  * Login
    - Allow Biometrics
      * Always: this will trigger biometrics every time the user brings app to foreground
      * On Login: this will trigger biometrics only when user needs to login
      * false: don't allow users to login with biometrics
  * Stacks
    - Use Vertical Stack: boolean value on whether to use a vertical stack
    - Use Horizontal Stack: boolean value on whether to use a horizontal stack
    - Default Stack: string to determine which stack to render first
      * Current Options: ["Vertical", "Horizontal"]
    - Vertical Stack
      * Order: ordered array of pages to use, first->last === top->bottom
        - Current Options:
          * All Asset View
          * Audio
          * Call Form
          * Camera
          * Horizontal Stack
          * Single Asset View
          * Video
      * Default: number, used to select which page to display first
    - Horizontal Stack
      * Order: ordered array of pages to use, first->last === left->right
        - Current Options:
          * All Asset View
          * Audio
          * Call Form
          * Camera
          * Single Asset View
          * Vertical Stack
          * Video
      * Default: number, used to select which page to display first
  * Pages
    - All Asset View
       * "Transfer Deleted": Boolean, whether to send "deleted" photos to server as Session Trash
    - Audio
      * Enable Blackout Mode: boolean, blackout mode on for audio page
      * Allow physical Buttons: boolean, whether to enable use of volume button as control source for recording start/stop
      * Android:
        - Recording Options: dictionary to set how to record audio
          * High
          * Low
      * iOS:
        - Recording Options: dictonary to set how to record the audio
          * High
          * Low
    - Call Form
      * Confirm Case Number: Boolean, whether to require users to confirm case number on submit
      * Confirm Number of Assets: Boolean, whether to require users to confirm number of assets 
        on submit
      * Submit Button Label: String, the displayed text for the submit button
        - No more than 16 characters
      * Fields: Array of dictionaries, ordered list describing what fields should populate in 
        the call form. First in array === first in list
        - Each field must be of the following type, with the following properties
          * Select: A list of various options
            - Allow Multiple: Boolean, whether to allow a user to select multiple options
            - Error Message: String, what message to display if an error has occured in the 
              selection process
            - Field Label: String, The text to let the user know what this field is about
            - Field Options: array of dictionaries. First option is selected by default
              * Label: String, what the option is displayed as
              * Value: Number (or string), what the value of the selection should be
            - Field Type: "select"
            - Help Message: String, what message to display to help the user figure out how to 
              make a proper selection
            - Required: Boolean, whether the field is required to be filled out
          * Text: a standard text input
            - Constraint: String, a regular expression defining a constraint to be placed on the text
            - Error Message: String, what message to display if an error has occurred in the filling out of the field
            - Field Label: String, the text to let the user know what this field is about
            - Field Type: "text"
            - Help Message: String, what message to display to help the user figure out how to fill the field out properly
            - Required: Boolean, whther the field is required or not
            - Text Mask: String, describes a mask to apply to the text
              * Text Mask will be filled with the 0 (zero) character, and any other character. This allows for the creation of phone numbers, while allowing the user to just type digits.
                - Examples: What we type | Mask | What we see
                  * Phone Number
                    - 9098994345 | (000) 000 - 0000 | (909) 899 - 4345
                  * Case Number
                    - 2112345 | 00-00000 | 21-12345
                  * Date
                    - 062919 | 00/00/00 | 06/29/19 
          * TextArea: a large field of text with free-form content
            - Error Message: String, what message to display if an error has occured in the entering of the field
            - Field Label: String, the text to let the user know what this field is about
            - Field Type: "textarea"
            - Help Message: String, what message to display to help the user figure out how to properly fill the field out
            - Maximum Length: Number, the maximum length the field is allowed to be
              * A value of -1 signifies no upper bound
            - Minimum Length: Number, the minimum length the field is allowed to be
              * A value of -1 signifies no lower bound
            - Required: Boolean, whether the field is required to be filled out
          * Date: a date/time picker
            - Allow Range: Boolean, whether to allow the selection of a date range
            - Error Message: String, what message to display if an error has occured in the 
              selection process
            - Field Label: String, The text to let the user know what this field is about
            - Field Type: "date"
            - Help Message: String, what message to display to help the user figure out how to 
              make a proper selection
            - Required: Boolean, whether the field is required to be filled out
            - Type Allowed: String, which types of date/time are allowed to be chosen
              * Full: Both date and time
              * Date: Only date
              * Time: Only time
          * Checkbox: a single choice selection from a single option
            - Field Label: String, the text to let the user know what this field is about
            - Field Type: "checkbox"
            - Default State: Boolean, true === checked / false === unchecked
          * Radio Group: array of strings, a single choice selection from multiple options
            - The order in the array describes the order of display 0 -> n === left -> right
    - Camera
      * Enable Blackout Mode: boolean, blackout mode on for camera page
      * Enable Physical Buttons: boolean, enable use of volume button as control
        source for camera
      * Controls: dictionary of values for how to control camera
        - Allow Focus: dictionary, controls focus functionality
          * Enable Focus: string, enables focus state for camera
            - All: Enables both auto focus mode, and manual focus mode
            - Auto: Enables auto focus mode only
            - Manual: Enables manual focus mode only
          * Default State: string, will control which is on by default
            - Auto
            - Manual
        - Allow Zoom: dictionary, controls zoom functionality
          * Enable Zoom: boolean, whether to allow zoom or not
          * Zoom Levels: dictionary, how to calculate zoom levels
            - Restrict Zoom: boolean, if true: will look for zoom levels allowed
            - Custom Range: array, listed as percentage. Will be converted to  
               value between 0 and 1
            - Starting Value: number, as a percentage. Will conver to value
              between 0 and 1
        - Allow Flash: dictionary, controls flash functionality
          * Enable Flash: boolean, if true, flash is allowed
          * Default State: string, whether to start with flash on or off
        - Allow Camera Flip: dictionary, controls camera face functionality
          * Enable Camera Flip: boolean, if true, allows toggling camera faces
          * Default State: string, which camera face to start on
            - Front
            - Back
      * Picture Size: string or null, if string: this represents size of picture;
        - if null: the largest size possible is used
        - iOS List:
        - Android List:
      * Picture Options: dictionary, options to take picture with
        - Quality: number, specify quality of compression
          * Values between 0 and 1
            - 0: maximum compression
            - 1: maximum quality
        - base64: boolean, include image data in base64 format
        - exif: boolean, whether to include exif data for image
    - Single Asset View
      * Audio Player
        - Enabled: boolean, whether to allow review of audio files
        - Back Duration: number, number of milliseconds to skip backwards
        - Forward Duration: number, number of milliseconds to skip forward
        - Rate: dictionary, controls the rate of playback options
          * Enabled, boolean, whether to show the rate button
          * Values: array of dictionary, the values to use for rate of playback
            - Each item will have two values
              * DisplayText: string, what to display on the button
              * Rate: number, the rate to change the playback to
                - possible values are floating point, and range between 0 - 32
                - value of 1 is normal playback
      * Image Viewer
        - Enabled: boolean, whether to allow review of image files
      * Video Player
        - Enabled: boolean, whether to allow review of video files
    - Summary
    - Video
      * Enable Blackout Mode: boolean, blackout mode on for video page
      * Enable Physical Buttons: boolean, enable use of volume button as control
        source for video capture
      * Controls: dictionary, which controls to display, and how they work
        - Allow Focus: dictionary, controls focus functionality
          * Enable Focus: string, enables focus state for camera
            - All: Enables both auto focus mode, and manual focus mode
            - Auto: Enables auto focus mode only
            - Manual: Enables manual focus mode only
          * Default State: string, will control which is on by default
            - Auto
            - Manual
        - Allow Zoom: dictionary, controls zoom functionality
          * Enable Zoom: boolean, whether to allow zoom or not
          * Zoom Levels: dictionary, how to calculate zoom levels
            - Restrict Zoom: boolean, if true: will look for zoom levels allowed
            - Custom Range: array, listed as percentage. Will be converted to  
               value between 0 and 1
            - Starting Value: number, as a percentage. Will conver to value
              between 0 and 1
        - Allow Camera Flip: dictionary, controls camera face functionality
          * Enable Camera Flip: boolean, if true, allows toggling camera faces
          * Default State: string, which camera face to start on
            - Front
            - Back
      * Record Options: dictionary, options to start record with
        - Quality: string or null, specify the quality of the video
          * if null, or value not available highest quality available is chosen
          * for 16:9 resolution:
            - 2160p
            - 1080p
            - 720p
            - 480p
          * for 4:3 resolution:
            - 640 x 480
        - Maximum Duration: number or null, maximum video duration in seconds
          * if null: record as long as possible
        - Maximum File Size: number or null, maximum video file size in bytes
          * if null record as long as possible
        - Mirror: boolean, iOS only.
          * if true, recorded video will be flipped along vertical axis
  * Default Options JSON:
    - {
        "Login": {
          "Allow Biometrics": false
        },
        "Stacks": {
          "Use Vertical Stack": true,
          "Use Horizontal Stack": true,
          "Default Stack": "Vertical",
          "Vertical Stack": {
            "Order": ["Horizontal Stack", "All Asset View", "Call Form"],
            "Default": 0
          },
          "Horizontal Stack": {
            "Order": ["Audio", "Camera", "Video"],
            "Default": 1
          }
        },
        "Pages": {
          "All Asset View": {
            "Transfer Deleted": false
          },
          "Audio": {
            "Android": "High",
            "Enable Blackout Mode": false,
            "Enable Physical Buttons": false,
            "iOS": "High",
          },
          "Call Form": {
            "Confirm Case Number": true,
            "Confirm Number of Assets": true,
            "Submit Button Label": "Sign and Submit",
            "Fields": [
              {
                "Field Label": "Case Number",
                "Field Type": "text",
                "Required": true,
                "Help Message": "Please enter the case number associated with this session",
                "Error Message": "The case number must match the pattern: 12-12345",
                "Constrain": "(\d{2})-(\d{5})",
                "Text Mask": "00-00000"
              },
              {
                "Field Label": "Offense Type",
                "Field Type": "select",
                "Allow Multiple": false,
                "Required": true,
                "Help Message": "Please select the primary offense type for this session",
                "Error Message": "This field is required",
                "Field Options": [
                  {
                    "Label": "Demo_1",
                    "Value": 0
                  },
                  {
                    "Label": "Demo_2",
                    "Value": 1
                  },
                  {
                    "Label": "Demo_3",
                    "Value": 2
                  }
                ]
              },
              {
                "Field Label": "Victim Name",
                "Field Type": "text",
                "Required": false,
                "Help Message": "Please enter the full name of the victim",
                "Error Message": "",
                "Constraints": ".*"
              },
              {
                "Field Label": "Date of Incident",
                "Field Type": "date",
                "Required": true,
                "Help Message": "Please select the date the incident occurred on",
                "Error Message": "This field is required. Please select a date",
              },
              {
                "Field Label": "Notes",
                "Field Type": "textarea",
                "Required": false,
                "Help Message": "This field is useful for adding contemporaneous notes on this specific capture session",
                "Error Message": "Exceeded maximum length",
                "Maximum Length": 256,
                "Minimum Length": null
              }
            ]
          },
          "Camera": {
            "Controls": {
              "Allow Camera Flip": {
                "Enable Camera Flip": true,
                "Default State": "Back"
              },
              "Allow Flash": {
                "Enable Flash": true,
                "Default State": "off"
              },
              "Allow Focus": {
                "Enable Focus": true,
                "Default State": "All"
              },
              "Allow Zoom": {
                "Enable Zoom": true,
                "Zoom Levels": {
                  "Custom Range": null,
                  "Restrict Zoom": false,
                  "Starting Value": 0,
                },
              },
            },
            "Enable Blackout Mode": false,
            "Enable Physical Buttons": false,
            "Picture Options": {
              "Quality": 1,
              "Base 64": false,
              "Exif": true
            },
            "Picture Size": null
          },
          "Single Asset View": {
            "Audio Player": {
              "Enabled": true,
              "Back Duration": 5000,
              "Forward Duration": 30000,
              "Rate": {
                "Enabled": true,
                "Values": [
                  { 
                    "DisplayText": "Slow",
                    "Rate": 0.8
                  },
                  { 
                    "DisplayText": "Normal",
                    "Rate": 1.0
                  }
                ]
              }
            },
            "Image Viewer": {
              "Enabled": true
            },
            "Video Player": {
              Enabled: true
            }
          },
          "Video": {
            "Controls": {
              "Allow Camera Flip": {
                "Enable Camera Flip": true,
                "Default State": "Back"
              },
              "Allow Focus": {
                "Enable Focus": true,
                "Default State": "All"
              },
              "Allow Zoom": {
                "Enable Zoom": true,
                "Zoom Levels": {
                  "Custom Range": null,
                  "Restrict Zoom": false,
                  "Starting Value": 0,
                },
              },
            },
            "Enable Blackout Mode": false,
            "Enable Physical Buttons": false,
            "Record Options": {
              "Maximum File Size": null,
              "Maximum Duration": null,
              "Mirror": false,
              "Quality": null,
            }
          }
        }
      }

# Database

- default (this info is open to the default user, so should have minimal information)
  * Agency_ID
    - "Agency Referral Code": String, a 4 character delimited (with 16 characters 
      total) for use in registering a device with an agency
- agency_info
  * Agency_ID
    - "Maximum Users Allowed": Number, describes how many concurrent users are 
      allowed at one time
      - a value of -1 represents an unlimited amount
    - "Current Users": Number, describes the current number of signed-in users
    - "Is Active": Boolean, describes whether agency is still a client
    - "Created On": Date, describes when the agency enrolled in service contract
- settings
  * Agency_ID
    - "Agency Settings": Dictionary describing information needed for application to run based on agency specifications
- settings
  * Agency_ID
    - "Agency Settings": Dictionary describing information needed for application to run based on agency specifications
- uploads
  * Agency_ID
    - session_ID
      * "Files": Array of dictionaries, lists all of the files that were transfered to the database
        - Each file will be one of the following types, and have all available metadata associated with that file type
          * Audio
            - file type: 'audio'
            - encrypted file blob
            - fingerprint
            - duration of audio
            - location (at the time the audio recording was stopped)
            - counter (4 digit)
            - recording options
              * High
                - Android
                  * extension: '.m4a'
                  * outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4
                  * audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC
                  * sampleRate: 44100
                  * numberOfChannels: 2
                  * bitRate: 128000
                - iOS
                  * extension: '.caf'
                  * audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX
                  * sampleRate: 44100
                  * numberOfChannels: 2
                  * bitRate: 128000
                  * linearPCMBitDepth: 16
                  * linearPCMIsBigEndian: false
                  * linearPCMIsFloat: false
              * Low
                - Android
                  * extension: '.3gp'
                  * outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP
                  * audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB
                  * sampleRate: 44100
                  * numberOfChannels: 2
                  * bitRate: 128000
                - iOS
                  * extension: '.caf'
                  * audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN
                  * sampleRate: 44100
                  * numberOfChannels: 2
                  * bitRate: 128000
                  * linearPCMBitDepth: 16
                  * linearPCMIsBigEndian: false
                  * linearPCMIsFloat: false
          * Image
            - file type: 'image'
            - encrypted file blob
            - fingerprint
            - exif
              * location included here
            - counter (4 digit)
          * Video
            - file type: 'video'
            - encrypted file blob
            - fingerprint
            - duration
            - encrypted thumbnail blob
            - thumbnail fingerprint
            - thumbnail exif
              * location included here
            - counter (4 digit)
      * "userID": String, unique identifier for user that initiated the session
      * "Call Form": array of dictionaries, lists the field and value of each entry in the call form submitted by the user.