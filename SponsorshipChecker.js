// ==UserScript==
// @name         Sponsorship Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically search for a company's sponsorship status and highlight realted keywords
// @author       Myrrolinz
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var keywords = ["sponsor", "sponsorship", "visa", "citizenship"];

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.tm-highlight { background-color: yellow; color: black; }';
    document.head.appendChild(style);

    function highlightText(node) {
        var text = node.nodeValue;
        var regex = new RegExp('(' + keywords.join('|') + ')', 'gi');
        var match = regex.exec(text);
        if (match) {
            var span = document.createElement('span');
            span.className = 'tm-highlight';
            var matchedText = match[0];
            var beforeMatch = text.substring(0, match.index);
            var afterMatch = text.substring(match.index + matchedText.length);

            if (beforeMatch) {
                node.nodeValue = beforeMatch;
                node.parentNode.insertBefore(span, node.nextSibling);
            } else {
                node.parentNode.replaceChild(span, node);
            }
            span.textContent = matchedText;

            if (afterMatch) {
                var afterNode = document.createTextNode(afterMatch);
                span.parentNode.insertBefore(afterNode, span.nextSibling);
                highlightText(afterNode);
            }
        }
    }

    // traverse the DOM tree, skip the nodes that don't need to be processed
    function walk(node) {
        var tagName = node.tagName ? node.tagName.toLowerCase() : '';
        if (tagName === 'script' || tagName === 'style' || tagName === 'textarea' || tagName === 'noscript') {
            return;
        }
        if (node.nodeType === 3) {
            highlightText(node);
        } else {
            for (var i = 0; i < node.childNodes.length; i++) {
                walk(node.childNodes[i]);
            }
        }
    }

    // begin traversal
    walk(document.body);
})();
