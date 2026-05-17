// grammar.js
module.exports = grammar({
  name: 'rangerrc',

  // 1. 핵심 해결책: 스페이스와 탭만 자동으로 무시하고, 줄바꿈(\n)은 파서가 직접 읽도록 강제합니다.
  extras: $ => [
    /[ \t]/
  ],

  rules: {
    // 파일은 여러 줄(Line)로 구성됨
    source_file: $ => repeat($._line),

    _line: $ => choice(
      $.comment,
      $._command_lines,
      '\n'
    ),

    // 2. 주석 규칙: 이제 앞의 공백은 extras가 처리하므로 깔끔하게 #부터 끝까지 잡습니다.
    comment: $ => /#[^\n]*/,

    _command_lines: $ => seq(
      choice(
        $.single_arg_command,
        $.double_arg_command
      ),
      '\n' // extras에서 \n을 제외했으므로 이제 줄바꿈을 완벽하게 인식합니다.
    ),

    // 3. 인자가 1개만 오는 명령어
    single_arg_command: $ => seq(
      alias(choice('unmap', 'eval', 'default_linemode'), $.keyword),
      optional($.argument_value)
    ),

    // 4. 인자가 2개 오는 명령어 (map, set 등)
    // 이제 extras가 공백을 자동으로 스킵하므로 /\s+/ 를 규칙에 직접 쓸 필요가 없습니다!
    double_arg_command: $ => seq(
      alias(choice(
        'set', 'setlocal', 'map', 'cmap', 'pmap', 'tmap',
        'copymap', 'copycmap', 'copypmap', 'copytmap', 'alias'
      ), $.keyword),
      $.argument_key,
      optional($.argument_value) // set global_inode_type_filter 처럼 값이 없는 경우를 위한 안전장치
    ),

    // 5. 첫 번째 인자: 공백이나 줄바꿈이 아닌 문자열 (여기에 #이 안전하게 매칭됩니다)
    argument_key: $ => /[^\s\n]+/,

    // 6. 두 번째 인자: 줄이 끝나기 전까지의 모든 문자
    argument_value: $ => /[^\n]+/
  }
});