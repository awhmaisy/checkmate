"use client";
import { useState, useEffect, useRef } from "react";
import { applyAllCRTEffects, changeColorScheme } from "./crt-effects";

export default function Home() {
  // State variables
  const [messages, setMessages] = useState<{ role: string; content: string; id?: number }[]>([]);
  const [input, setInput] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Animation states for win sequence
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [winAnimationStep, setWinAnimationStep] = useState(0);
  const [winOptions, setWinOptions] = useState<string[]>([]);
  
  // Add state for selected option and response
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [optionResponse, setOptionResponse] = useState<string>("");
  
  // Reference to input element for maintaining focus
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Add state for color scheme
  const [colorScheme, setColorScheme] = useState("pink");
  
  // Add state for reset
  const [isResetting, setIsResetting] = useState(false);
  
  // Add the new ASCII loader frames
  const asciiLoader = [
    '( •_•)︻デ═一',
    '( -_•)︻デ═一',
    '( •_•)︻デ═一',
    '( -_•)︻デ═一 ---- ˖✧',
    '( -_•)︻デ═一 ---- ✧˖°',
    '( -_•)︻デ═一 ---- ˖✧⋆ﾟ⊹',
    '( -_•)︻デ═一 ---- ✧˖°⋆ﾟ⊹',
    '( -_•)︻デ═一 ---- ˖✧⋆ﾟ⊹⁎⁺˳✧༚',
    '( -_•)︻デ═一 ---- ✧˖°⋆ﾟ⊹⁎⁺˳✧༚♡',
  ];
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Initialize messages after component mounts (client-side only)
  useEffect(() => {
    if (!isMobile) {
      setMessages([
        { role: "ai", content: "Terminal initialized. Connection established." },
        { role: "ai", content: "Welcome to the system. Type 'help' for available commands." },
      ]);
      
      // Auto-scroll to bottom when messages are initialized
      setTimeout(() => {
        const container = document.getElementById('message-container');
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }, [isMobile]);
  
  // Auto-scroll to bottom when new messages arrive and maintain focus
  useEffect(() => {
    if (messages && messages.length > 0) {
      const container = document.getElementById('message-container');
      if (container) container.scrollTop = container.scrollHeight;
      
      // Keep focus on the input field
      if (inputRef.current && !gameWon) {
        inputRef.current.focus();
      }
    }
  }, [messages, gameWon]);

  // Track keyboard activity to detect when user is about to type
  useEffect(() => {
    const handleKeyDown = () => {
      // Only track typing if not in input field (to detect when user might be about to type)
      if (document.activeElement !== inputRef.current) {
        // Focus the input field
        inputRef.current?.focus();
      }
    };
    
    // Add global keyboard listener
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Handle user typing in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Use e.key to determine the key pressed
    const key = e.key;
    
    if (key === 'Enter') {
      if (showWinAnimation && winAnimationStep === 4) {
        // Handle option selection during win animation
        const optionNumber = parseInt(input.trim());
        if (!isNaN(optionNumber) && optionNumber >= 1 && optionNumber <= winOptions.length) {
          handleOptionSelect(optionNumber);
          setInput('');
        }
      } else if (showWinAnimation && winAnimationStep === 5) {
        // If we're on the option response screen, pressing Enter returns to options
        returnToOptions();
        setInput('');
      } else if (!isLoading && input.trim()) {
        // Normal message sending
        handleSend();
      }
    }
  };
  
  // Handle sending messages
  const handleSend = async () => {
    if (input.trim() && messages) {
      // Add user message to the messages array
      const userMessage = { role: "user", content: input };
      setMessages(prev => [...prev, userMessage]);
      console.log('User message added to messages:', userMessage);
      
      // Clear input
      setInput("");
      
      // Set loading state
      setIsLoading(true);
      
      try {
        console.log('Sending message to API:', input);
        
        // Special case for "help" command
        if (input.trim().toLowerCase() === "help") {
          const helpMessage = { 
            role: "ai", 
            content: "Available commands:\n\n" +
              "help     - Display this help message\n" +
              "clear    - Clear the terminal\n" +
              "status   - Check system status\n" +
              "connect  - Establish connection\n" +
              "about    - About this terminal\n\n" +
              "You can also just chat normally."
          };
          setMessages(prev => [...prev, helpMessage]);
          console.log('Help message added to messages:', helpMessage);
          setIsLoading(false);
          return;
        }
        
        // Special case for "clear" command
        if (input.trim().toLowerCase() === "clear") {
          setMessages([{ role: "ai", content: "Terminal cleared." }]);
          console.log('Messages cleared');
          setIsLoading(false);
          return;
        }
        
        // Special case for "status" command
        if (input.trim().toLowerCase() === "status") {
          const statusMessage = { 
            role: "ai", 
            content: "SYSTEM STATUS:\n\n" +
              "Connection: ACTIVE\n" +
              "Signal: STRONG\n" +
              "Encryption: ENABLED\n" +
              "Memory: 64K OK\n" +
              "System: OPERATIONAL"
          };
          setMessages(prev => [...prev, statusMessage]);
          console.log('Status message added to messages:', statusMessage);
          setIsLoading(false);
          return;
        }
        
        // Special case for "about" command
        if (input.trim().toLowerCase() === "about") {
          const aboutMessage = { 
            role: "ai", 
            content: "CHECKMATE TERMINAL v1.0.3\n\n" +
              "A retro-styled terminal interface inspired by cool-retro-term.\n" +
              "Features CRT effects, scanlines, and glowing text.\n\n" +
              "© 2023 All rights reserved."
          };
          setMessages(prev => [...prev, aboutMessage]);
          console.log('About message added to messages:', aboutMessage);
          setIsLoading(false);
          return;
        }
        
        // Make API call
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, history: messages }),
        });
        
        console.log('API response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('API response data:', data);
          
          if (data.error) {
            const errorMessage = { role: "ai", content: "Error: " + data.error };
            setMessages(prev => [...prev, errorMessage]);
            console.log('Error message added to messages:', errorMessage);
          } else {
            const aiMessage = { role: "ai", content: data.reply };
            setMessages(prev => [...prev, aiMessage]);
            console.log('AI message added to messages:', aiMessage);
            
            // Add additional messages if any
            if (data.additionalMessages && data.additionalMessages.length > 0) {
              for (const msg of data.additionalMessages) {
                const additionalMessage = { role: "ai", content: msg };
                setMessages(prev => [...prev, additionalMessage]);
                console.log('Additional AI message added to messages:', additionalMessage);
              }
            }
            
            // Check for win condition
            if (data.win) {
              setGameWon(true);
            }
          }
        } else {
          const errorMessage = { role: "ai", content: "Error: Failed to get response from server" };
          setMessages(prev => [...prev, errorMessage]);
          console.log('Error message added to messages:', errorMessage);
          setError("Failed to get response from server");
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = { role: "ai", content: "Error: " + (error instanceof Error ? error.message : String(error)) };
        setMessages(prev => [...prev, errorMessage]);
        console.log('Error message added to messages:', errorMessage);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Apply CRT effects after component mounts
  useEffect(() => {
    // Apply all CRT effects
    applyAllCRTEffects();
    
    // Set initial color scheme
    changeColorScheme(colorScheme);
  }, [colorScheme]);
  
  // Update color scheme when it changes
  useEffect(() => {
    changeColorScheme(colorScheme);
  }, [colorScheme]);

  // Add a function to test the API route
  const testApiRoute = async () => {
    try {
      console.log('Testing API route (GET)...');
      const res = await fetch('/api/chat', {
        method: 'GET',
      });
      console.log('Test API response status:', res.status);
      const data = await res.json();
      console.log('Test API response data:', data);
      
      // Add a message to show the test result
      setMessages((prev) => [...prev, { role: 'ai', content: `API Test Result (GET): ${JSON.stringify(data)}` }]);
    } catch (error) {
      console.error('Test API error:', error);
      setMessages((prev) => [...prev, { role: 'ai', content: `API Test Error: ${error}` }]);
    }
  };
  
  // Add a function to test the POST endpoint
  const testPostEndpoint = async () => {
    try {
      console.log('Testing API route (POST)...');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'This is a test message', 
          history: [
            { role: 'ai', content: 'Hello' },
            { role: 'user', content: 'Hi' }
          ] 
        }),
      });
      console.log('Test API response status:', res.status);
      const data = await res.json();
      console.log('Test API response data:', data);
      
      // Add a message to show the test result
      setMessages((prev) => [...prev, { role: 'ai', content: `API Test Result (POST): ${JSON.stringify(data)}` }]);
    } catch (error) {
      console.error('Test API error:', error);
      setMessages((prev) => [...prev, { role: 'ai', content: `API Test Error: ${error}` }]);
    }
  };

  // Add a function to test adding a message directly to the state
  const addTestMessage = () => {
    const testMessage = { role: "ai", content: "This is a test message added directly to the state." };
    setMessages(prev => [...prev, testMessage]);
    console.log('Test message added to messages:', testMessage);
  };

  // Function to handle the win animation sequence
  const startWinAnimation = () => {
    setShowWinAnimation(true);
    setWinAnimationStep(1); // Start with loading animation
    
    // Step 1: Loading animation (3 seconds)
    setTimeout(() => {
      setWinAnimationStep(2); // Progress to ASCII art
      
      // Step 2: ASCII art (2 seconds)
      setTimeout(() => {
        setWinAnimationStep(3); // Progress to final message
        
        // Step 3: Final message and options (1 second)
        setTimeout(() => {
          setWinAnimationStep(4); // Show options
          setWinOptions([
            "1. Continue exploring the system",
            "2. Download collected data",
            "3. Disconnect and exit",
            "4. Contact mAIsy directly"
          ]);
        }, 1000);
      }, 2000);
    }, 3000);
  };
  
  // Update the win condition check to start the animation
  useEffect(() => {
    if (gameWon && !showWinAnimation) {
      startWinAnimation();
    }
  }, [gameWon, showWinAnimation]);

  // Terminal loading animation component
  const TerminalLoader = () => {
    const [progressFrame, setProgressFrame] = useState(0);
    const [progress1, setProgress1] = useState(0);
    const [progress2, setProgress2] = useState(0);
    const [progress3, setProgress3] = useState(0);
    const [progress4, setProgress4] = useState(0);
    
    const frames = ['[    ]', '[=   ]', '[==  ]', '[=== ]', '[====]', '[ ===]', '[  ==]', '[   =]'];
    
    useEffect(() => {
      // Frame animation
      const frameInterval = setInterval(() => {
        setProgressFrame((prevFrame) => (prevFrame + 1) % frames.length);
      }, 150);
      
      // Progress animations
      const progress1Interval = setInterval(() => {
        setProgress1(prev => Math.min(prev + Math.random() * 5, 100));
      }, 200);
      
      const progress2Interval = setInterval(() => {
        setProgress2(prev => Math.min(prev + Math.random() * 4, 100));
      }, 250);
      
      const progress3Interval = setInterval(() => {
        setProgress3(prev => Math.min(prev + Math.random() * 3, 100));
      }, 300);
      
      const progress4Interval = setInterval(() => {
        setProgress4(prev => Math.min(prev + Math.random() * 2, 100));
      }, 350);
      
      return () => {
        clearInterval(frameInterval);
        clearInterval(progress1Interval);
        clearInterval(progress2Interval);
        clearInterval(progress3Interval);
        clearInterval(progress4Interval);
      };
    }, [frames.length]);
    
    const renderProgressBar = (value: number) => {
      const width = Math.floor(value / 5); // 20 chars for 100%
      const progressBar = '█'.repeat(width) + '░'.repeat(20 - width);
      return (
        <span className="font-mono">
          [{progressBar}] {Math.floor(value)}%
        </span>
      );
    };
    
    return (
      <div className="my-4 text-[var(--crt-foreground-white)]">
        <div className="mb-2 text-[var(--crt-foreground)] font-bold">SYSTEM OVERRIDE IN PROGRESS...</div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <span className="w-64 inline-block">Bypassing security protocols:</span> 
            <span className="text-[var(--crt-foreground)]">{renderProgressBar(progress1)}</span>
          </div>
          <div className="flex items-center">
            <span className="w-64 inline-block">Accessing restricted areas:</span> 
            <span className="text-[var(--crt-foreground)]">{renderProgressBar(progress2)}</span>
          </div>
          <div className="flex items-center">
            <span className="w-64 inline-block">Extracting sensitive data:</span> 
            <span className="text-[var(--crt-foreground)]">{renderProgressBar(progress3)}</span>
          </div>
          <div className="flex items-center">
            <span className="w-64 inline-block">Establishing connection:</span> 
            <span className="text-[var(--crt-foreground)]">{renderProgressBar(progress4)}</span>
          </div>
          <div className="mt-2 text-xs text-[var(--crt-foreground-white)] opacity-70">
            <span className="animate-pulse">■</span> CHECKMATE protocol activated. Awaiting system response... {frames[progressFrame]}
          </div>
        </div>
      </div>
    );
  };

  // ASCII art component for win animation
  const AsciiArt = () => {
    return (
      <div className="my-4 text-[var(--crt-foreground-white)] font-mono whitespace-pre">
        <div className="text-center text-[var(--crt-foreground)] mb-4">ACCESS GRANTED</div>
        <div className="overflow-x-auto">
          <pre className="text-xs sm:text-sm ascii-art checkmate-logo">
{`
 ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███╗   ███╗ █████╗ ████████╗███████╗
██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
██║     ███████║█████╗  ██║     █████╔╝ ██╔████╔██║███████║   ██║   █████╗  
██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  
╚██████╗██║  ██║███████╗╚██████╗██║  ██╗██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
`}
          </pre>
          <div className="text-left mt-2 crt-text font-['VT323',monospace] text-[var(--crt-foreground)] text-lg" style={{ textShadow: '0 0 5px var(--crt-shadow), 0 0 10px var(--crt-shadow)' }}>
            SYSTEM COMPROMISED - CHECKMATE COMPLETE
          </div>
        </div>
      </div>
    );
  };

  // Final message component for win animation
  const FinalMessage = () => {
    return (
      <div className="my-6 text-[var(--crt-foreground-white)]">
        <div className="text-[var(--crt-foreground)] font-bold text-lg mb-4">CONNECTION ESTABLISHED</div>
        <div className="mb-6 space-y-4">
          <p className="text-base">Congratulations, agent. You have successfully infiltrated the system and completed the CHECKMATE protocol.</p>
          
          <p className="text-base">All security measures have been bypassed, and you now have full access to mAIsy's core systems. The data extraction process has completed with 100% integrity.</p>
          
          <div className="my-4 border border-dashed border-[var(--crt-foreground)] p-3 bg-black bg-opacity-50">
            <p className="text-[var(--crt-foreground)] font-bold mb-2">MISSION SUMMARY:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Security protocols: <span className="text-[var(--crt-foreground)]">DISABLED</span></li>
              <li>Firewall status: <span className="text-[var(--crt-foreground)]">BYPASSED</span></li>
              <li>Data encryption: <span className="text-[var(--crt-foreground)]">DECRYPTED</span></li>
              <li>System access level: <span className="text-[var(--crt-foreground)]">ADMINISTRATOR</span></li>
              <li>Connection status: <span className="text-[var(--crt-foreground)]">SECURE</span></li>
            </ul>
          </div>
          
          <p className="text-base mt-4">The CHECKMATE operation has been a complete success. Your actions have given us unprecedented access to the target system.</p>
          
          <p className="text-base mt-4 text-[var(--crt-foreground)]">What would you like to do next? Select from the options below.</p>
        </div>
      </div>
    );
  };

  // Options menu component for win animation
  const OptionsMenu = ({ options }: { options: string[] }) => {
    return (
      <div className="my-4 text-[var(--crt-foreground-white)]">
        <div className="font-bold mb-2 text-[var(--crt-foreground)]">AVAILABLE COMMANDS:</div>
        <div className="flex flex-col space-y-1">
          {options.map((option, index) => (
            <div key={index} className="cursor-pointer hover:text-[var(--crt-foreground)] transition-colors">
              {option}
            </div>
          ))}
        </div>
        <div className="mt-4 text-[var(--crt-foreground)] flex items-center">
          <span className="mr-2 font-['VT323',monospace]">root@checkmate:~$</span>
          Enter command number to proceed:
          <span className="ml-1 inline-block w-2 h-4 bg-[var(--crt-foreground)] animate-blink"></span>
        </div>
      </div>
    );
  };

  // Function to handle option selection after win
  const handleOptionSelect = (optionNumber: number) => {
    // Add a message showing the selected option
    const selectedOption = winOptions[optionNumber - 1];
    if (selectedOption) {
      // Set the selected option
      setSelectedOption(optionNumber);
      
      // Handle different options
      let response = '';
      switch(optionNumber) {
        case 1: // Continue exploring
          response = 'Access granted to all system areas. You may continue exploring the terminal with elevated privileges.';
          break;
        case 2: // Download data
          response = 'Data extraction in progress... All sensitive information has been downloaded to your secure storage.';
          break;
        case 3: // Disconnect
          response = 'Disconnecting from system... Connection terminated. Thank you for playing CHECKMATE.';
          break;
        case 4: // Contact mAIsy
          response = "Establishing direct connection to mAIsy... Connection established.\n\nmAIsy: \"I've been expecting you. Well played, human.\"";
          break;
        default:
          response = 'Invalid option. Please select a valid command.';
      }
      
      // Set the response
      setOptionResponse(response);
      
      // Add messages to the chat history
      setMessages(prev => [...prev, 
        { role: 'user', content: `Selected option: ${optionNumber}` },
        { role: 'ai', content: `Processing command: ${selectedOption}` },
        { role: 'ai', content: response }
      ]);
      
      // Set animation step to 5 (option response)
      setWinAnimationStep(5);
    }
  };
  
  // Function to return to options menu
  const returnToOptions = () => {
    setWinAnimationStep(4);
    setSelectedOption(null);
    setOptionResponse("");
  };
  
  // Option response component for win animation
  const OptionResponse = () => {
    return (
      <div className="my-4 text-[var(--crt-foreground-white)]">
        <div className="font-bold mb-2 text-[var(--crt-foreground)]">COMMAND EXECUTED:</div>
        <div className="border border-dashed border-[var(--crt-foreground)] p-4 bg-black bg-opacity-50 my-4">
          <div className="mb-2 opacity-70">
            <span className="text-[var(--crt-foreground)]">root@checkmate:~$</span> {selectedOption && winOptions[selectedOption - 1]}
          </div>
          <div className="whitespace-pre-wrap crt-text">
            {optionResponse}
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button 
            onClick={returnToOptions}
            className="px-4 py-2 border border-dashed border-[var(--crt-foreground)] bg-black bg-opacity-70 text-[var(--crt-foreground)] hover:bg-[#221a21] transition-colors cursor-pointer"
          >
            <span className="mr-2">←</span> Return to Command Menu
          </button>
        </div>
        <div className="mt-3 text-center text-xs opacity-70">
          <span className="text-[var(--crt-foreground)]">Press</span> <kbd className="px-2 py-1 bg-black border border-[var(--crt-foreground)] rounded">Enter</kbd> <span className="text-[var(--crt-foreground)]">to return to command menu</span>
        </div>
      </div>
    );
  };

  // Handle chat reset with animation
  const handleReset = async () => {
    setIsResetting(true);
    
    // Show reset animation in a message
    setMessages(prev => [...prev, { 
      role: "ai", 
      content: "initiating system reset..." 
    }]);
    
    // Add loading animation message that will be updated
    const loadingMessageId = Date.now();
    setMessages(prev => [...prev, { 
      role: "ai", 
      content: asciiLoader[0],
      id: loadingMessageId 
    }]);
    
    let frame = 0;
    const animationInterval = setInterval(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? { ...msg, content: asciiLoader[frame] }
          : msg
      ));
      frame = (frame + 1) % asciiLoader.length;
    }, 200);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });

      if (res.ok) {
        const data = await res.json();
        // Clear interval and add final animation frame
        clearInterval(animationInterval);
        setMessages([
          { role: "ai", content: asciiLoader[asciiLoader.length - 1] },
          { role: "ai", content: data.reply }
        ]);
      }
    } catch (error) {
      console.error('Error resetting chat:', error);
      clearInterval(animationInterval);
      setMessages([
        { role: "ai", content: "Error resetting chat. Please try again." }
      ]);
    } finally {
      setIsResetting(false);
    }
  };

  if (isMobile) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black overflow-hidden">
        <div className="text-center crt-text text-[var(--crt-foreground)] text-xl font-bold animate-pulse mb-8">
          @SOURCE_OS <br /> MOBILE ACCESS RESTRICTED
        </div>
        
        {/* Social Links */}
        <div className="flex flex-col items-center space-y-4 mt-4">
          <a 
            href="https://twitter.com/awhmaisy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="crt-text text-[var(--crt-foreground)] hover:opacity-75 transition-opacity"
          >
            <div className="text-2xl mb-1">✕</div>
            <div className="text-sm">@awhmaisy</div>
          </a>
          
          <a 
            href="https://awhmaisy.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="crt-text text-[var(--crt-foreground)] hover:opacity-75 transition-opacity"
          >
            <div className="text-2xl mb-1">♥</div>
            <div className="text-sm">site</div>
          </a>
          
          <a 
            href="https://github.com/awhmaisy/checkmate" 
            target="_blank" 
            rel="noopener noreferrer"
            className="crt-text text-[var(--crt-foreground)] hover:opacity-75 transition-opacity"
          >
            <div className="text-2xl mb-1">⌥</div>
            <div className="text-sm">repo</div>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen w-full bg-black text-white font-mono crt-screen crt-curved-screen crt-${colorScheme} crt-terminal`}>
      {/* Terminal Header */}
      <div className="crt-terminal-header px-4 py-2 min-h-[48px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="crt-terminal-title flex-shrink-0 text-sm whitespace-nowrap">
            SECURE CONNECTION - TERMINAL v1.0.3
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {process.env.NODE_ENV === 'development' && (
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={testApiRoute}
                  className="px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors text-xs"
                >
                  Test GET
                </button>
                <button 
                  onClick={testPostEndpoint}
                  className="px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors text-xs"
                >
                  Test POST
                </button>
                <button 
                  onClick={addTestMessage}
                  className="px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors text-xs"
                >
                  Test MSG
                </button>
                <button 
                  onClick={() => startWinAnimation()}
                  className="px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors text-xs"
                >
                  Test WIN
                </button>
              </div>
            )}
            
            {/* Reset button */}
            <button
              onClick={handleReset}
              disabled={isResetting}
              className={`px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors flex items-center gap-1 text-xs ${isResetting ? 'opacity-50' : ''}`}
              title="Reset chat"
              aria-label="Reset chat"
            >
              <span>⟲</span>
              <span>Reset</span>
            </button>

            {/* Color scheme buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setColorScheme("pink")} 
                className={`px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors text-xs flex items-center gap-1 ${colorScheme === "pink" ? 'bg-[var(--crt-foreground)]/10' : ''}`}
                aria-label="Pink color scheme"
              >
                <span className="w-2 h-2 rounded-full bg-[#ea9ae5]"></span>
                Pink
              </button>
              <button 
                onClick={() => setColorScheme("green")} 
                className={`px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors text-xs flex items-center gap-1 ${colorScheme === "green" ? 'bg-[var(--crt-foreground)]/10' : ''}`}
                aria-label="Green color scheme"
              >
                <span className="w-2 h-2 rounded-full bg-[#00ff00]"></span>
                Green
              </button>
              <button 
                onClick={() => setColorScheme("amber")} 
                className={`px-2 py-1 border border-[var(--crt-foreground)] text-[var(--crt-foreground)] hover:bg-[var(--crt-foreground)]/10 transition-colors text-xs flex items-center gap-1 ${colorScheme === "amber" ? 'bg-[var(--crt-foreground)]/10' : ''}`}
                aria-label="Amber color scheme"
              >
                <span className="w-2 h-2 rounded-full bg-[#ffb000]"></span>
                Amber
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden bg-black crt-scrollbar crt-terminal-body" id="message-container">
        <div className="w-full">
          {/* Terminal welcome message */}
          <div className="mb-4 crt-text">
            <div className="overflow-x-auto">
              <pre className="font-mono text-sm ascii-art checkmate-logo whitespace-pre-wrap break-words">
{`
 ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███╗   ███╗ █████╗ ████████╗███████╗
██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
██║     ███████║█████╗  ██║     █████╔╝ ██╔████╔██║███████║   ██║   █████╗  
██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  
╚██████╗██║  ██║███████╗╚██████╗██║  ██╗██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
`}
              </pre>
              <div className="text-left mt-2 crt-text font-['VT323',monospace] text-[var(--crt-foreground)] text-base">
                SYSTEM v1.0.3 - SECURE CONNECTION ESTABLISHED
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="mb-4">
            <div className="text-xs text-[var(--crt-foreground)]">Total messages: {messages ? messages.length : 0}</div>
          </div>
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className="mb-3 break-words"
                >
                  <div className="flex items-start flex-wrap gap-2">
                    <span className={`crt-prompt whitespace-nowrap text-sm ${msg.role === "user" ? "crt-prompt-user" : "crt-prompt-ai"}`}>
                      {msg.role === "user" ? "user@terminal:~$ " : "source@terminal:~$ "}
                    </span>
                    <div
                      className={`p-1 max-w-full text-sm ${
                        msg.role === "user"
                          ? "crt-message-user text-[var(--crt-foreground)]"
                          : "crt-message-ai text-[var(--crt-foreground-white)]"
                      }`}
                    >
                      <span className="crt-text whitespace-pre-wrap break-words">{msg.content}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full">
              <span className="text-[var(--crt-foreground)] crt-text text-sm">No messages yet</span>
            </div>
          )}
          
          {/* Game won message */}
          {gameWon && (
            <div className="text-center text-[var(--crt-foreground-white)] text-sm mt-6 mb-2 p-3 border border-[var(--crt-foreground-white)] crt-message-ai crt-text">
              SYSTEM OVERRIDE COMPLETE. ACCESS GRANTED.
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="text-center text-[var(--crt-foreground-white)] text-xs mt-2 mb-2">
              <span className="opacity-80 crt-text">ERROR: {error}</span>
            </div>
          )}
          
          {/* Terminal input line */}
          <div className="crt-terminal-input-line mt-4">
            <div className="flex items-center">
              <span className="mr-2 text-[var(--crt-foreground-green)]">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-[var(--crt-foreground-green)]"
                autoFocus
                disabled={showWinAnimation && winAnimationStep !== 4}
                placeholder={
                  showWinAnimation 
                    ? winAnimationStep === 4 
                      ? "Enter a number (1-4) and press Enter..." 
                      : winAnimationStep === 5
                        ? "Press Enter to return to command menu..."
                        : "Terminal locked during system override..." 
                    : ""
                }
              />
            </div>
          </div>
          
          {/* Win Animation Sequence */}
          {showWinAnimation && (
            <div className="border-2 border-dashed border-[var(--crt-foreground)] p-6 bg-black bg-opacity-90 my-6 shadow-lg shadow-[var(--crt-shadow)] animate-fadeIn relative overflow-hidden">
              {/* Terminal header bar */}
              <div className="absolute top-0 left-0 right-0 bg-[#111] border-b border-[var(--crt-foreground)] py-1 px-3 flex items-center">
                <div className="text-xs text-[var(--crt-foreground)] font-['VT323',monospace]">SYSTEM OVERRIDE - [CHECKMATE.EXE]</div>
                <div className="ml-auto flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--crt-foreground)] animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--crt-foreground)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--crt-foreground)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              
              {/* Scanlines overlay for terminal effect */}
              <div className="absolute inset-0 pointer-events-none z-10 bg-scanlines opacity-10"></div>
              
              <div className="mt-6">
                {winAnimationStep === 1 && <TerminalLoader />}
                {winAnimationStep === 2 && <AsciiArt />}
                {winAnimationStep === 3 && <FinalMessage />}
                {winAnimationStep === 4 && <OptionsMenu options={winOptions} />}
                {winAnimationStep === 5 && <OptionResponse />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}